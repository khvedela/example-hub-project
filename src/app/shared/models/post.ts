export interface Comment {
  id: number;
  date: string;
  text: string;
  likes: number;
}

export interface NewComment {
  id: number;
  text: string;
  likes: number;
  date: Date;
}

export interface Post {
  id: number;
  date: string;
  title: string;
  text: string;
  likes: number;
  comments: Comment[];
}
