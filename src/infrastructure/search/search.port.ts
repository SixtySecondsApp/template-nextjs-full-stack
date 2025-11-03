import { Post } from "@/domain/post/post.entity";
import { Comment } from "@/domain/comment/comment.entity";
import { User } from "@/domain/user/user.entity";

/**
 * SearchResults Type
 * Combined search results for posts, comments, and members
 */
export interface SearchResults {
  posts: Post[];
  comments: Comment[];
  members: User[];
  totalResults: number;
}

/**
 * ISearchAdapter Interface
 * Defines contract for search operations
 *
 * Part of the Ports layer - infrastructure implementations must satisfy this interface.
 */
export interface ISearchAdapter {
  /**
   * Search for posts by keyword in title and content.
   * @param query Search query string
   * @param communityId Community ID to scope search
   * @returns Array of matching Post domain entities
   */
  searchPosts(query: string, communityId: string): Promise<Post[]>;

  /**
   * Search for comments by keyword in content.
   * @param query Search query string
   * @param communityId Community ID to scope search
   * @returns Array of matching Comment domain entities
   */
  searchComments(query: string, communityId: string): Promise<Comment[]>;

  /**
   * Search for members by keyword in name and email.
   * @param query Search query string
   * @param communityId Community ID to scope search
   * @returns Array of matching User domain entities
   */
  searchMembers(query: string, communityId: string): Promise<User[]>;

  /**
   * Perform combined global search across posts, comments, and members.
   * @param query Search query string
   * @param communityId Community ID to scope search
   * @returns SearchResults containing posts, comments, members, and total count
   */
  globalSearch(query: string, communityId: string): Promise<SearchResults>;
}
