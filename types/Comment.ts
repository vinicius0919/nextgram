import { Post } from "./Post";
import { User } from "./User";

export interface Comment {
    id: string;
    userId: string;
    postId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    post?: Post;
}