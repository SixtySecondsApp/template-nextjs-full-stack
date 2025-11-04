/**
 * Save Draft Use Case
 * Creates or updates post draft with 7-day expiry
 * Enables auto-save functionality for post composer
 */

import { IPostDraftRepository, IUserRepository } from "@/ports/repositories";
import { PostDraftDto, SaveDraftDto } from "@/application/dtos/post-draft.dto";
import { DraftError } from "@/application/errors/post.errors";

export class SaveDraftUseCase {
  constructor(
    private draftRepository: IPostDraftRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Execute save draft operation
   * Creates new draft or updates existing draft
   * Sets 7-day expiry from current time
   * @param input SaveDraftDto with userId, optional postId, and content
   * @returns PostDraftDto with assigned ID and expiry
   * @throws Error with DraftError enum values
   */
  async execute(input: SaveDraftDto): Promise<PostDraftDto> {
    try {
      // Validate input
      if (!input.userId || input.userId.trim().length === 0) {
        throw new Error(DraftError.USER_NOT_FOUND);
      }
      if (!input.content || input.content.trim().length === 0) {
        throw new Error(DraftError.EMPTY_CONTENT);
      }

      // Verify user exists
      const user = await this.userRepository.findById(input.userId);
      if (!user) {
        throw new Error(DraftError.USER_NOT_FOUND);
      }

      // Calculate expiry (7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Check if draft already exists
      const existingDraft = await this.draftRepository.findByUserAndPost(
        input.userId,
        input.postId || null
      );

      let savedDraft;

      if (existingDraft) {
        // Update existing draft
        savedDraft = await this.draftRepository.update({
          ...existingDraft,
          content: input.content,
          expiresAt,
          updatedAt: new Date(),
        });
      } else {
        // Create new draft
        const draft = {
          id: crypto.randomUUID(),
          userId: input.userId,
          postId: input.postId || null,
          content: input.content,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        savedDraft = await this.draftRepository.create(draft);
      }

      // Return DTO (map to ISO strings)
      return {
        id: savedDraft.id,
        userId: savedDraft.userId,
        postId: savedDraft.postId,
        content: savedDraft.content,
        expiresAt: savedDraft.expiresAt.toISOString(),
        createdAt: savedDraft.createdAt.toISOString(),
        updatedAt: savedDraft.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === DraftError.USER_NOT_FOUND ||
          error.message === DraftError.EMPTY_CONTENT ||
          error.message === DraftError.INVALID_CONTENT
        ) {
          throw error;
        }
      }
      throw new Error(DraftError.INTERNAL_SERVER_ERROR);
    }
  }
}
