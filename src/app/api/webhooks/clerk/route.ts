import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Type definitions for Clerk webhook events
interface ClerkUser {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
}

interface UserCreatedEvent {
  type: 'user.created';
  data: ClerkUser;
}

interface UserUpdatedEvent {
  type: 'user.updated';
  data: ClerkUser;
}

interface UserDeletedEvent {
  type: 'user.deleted';
  data: {
    id: string;
  };
}

type ClerkEvent = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;

export async function POST(req: Request) {
  // Verify webhook signature
  const headersList = await headers();
  const svixId = headersList.get('svix-id');
  const svixTimestamp = headersList.get('svix-timestamp');
  const svixSignature = headersList.get('svix-signature');

  // Return 400 if headers are missing
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing required headers', { status: 400 });
  }

  // Get the body
  const body = await req.text();

  // Create webhook instance and verify
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let event: ClerkEvent;
  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkEvent;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return new Response('Webhook verification failed', { status: 400 });
  }

  try {
    // Handle different event types
    switch (event.type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
          console.warn(`Clerk user ${id} has no email address`);
          return new Response('No email address provided', { status: 400 });
        }

        // Create user in database
        await prisma.user.create({
          data: {
            clerkId: id,
            email,
            firstName: first_name || undefined,
            lastName: last_name || undefined,
            imageUrl: image_url || undefined,
          },
        });

        console.log(`Created user ${id} (${email})`);
        break;
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
          console.warn(`Clerk user ${id} has no email address`);
          return new Response('No email address provided', { status: 400 });
        }

        // Update user in database
        await prisma.user.update({
          where: { clerkId: id },
          data: {
            email,
            firstName: first_name || undefined,
            lastName: last_name || undefined,
            imageUrl: image_url || undefined,
            updatedAt: new Date(),
          },
        });

        console.log(`Updated user ${id} (${email})`);
        break;
      }

      case 'user.deleted': {
        const { id } = event.data;

        // Soft delete: set deletedAt timestamp
        await prisma.user.update({
          where: { clerkId: id },
          data: {
            deletedAt: new Date(),
          },
        });

        console.log(`Deleted user ${id}`);
        break;
      }

      default: {
        console.warn(`Unhandled webhook event type: ${(event as any).type}`);
      }
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);

    // Return 500 to trigger Clerk retry
    return new Response('Internal server error', { status: 500 });
  }
}
