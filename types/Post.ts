import { Comment } from "./Comment";
import { Like } from "./Like";
import { User } from "./User";

export interface Post {
    id: string;
    imageUrl: string;
    caption?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    likes?: Like[] | [];
    comments?: Comment[] | [];
}
