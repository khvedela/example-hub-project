import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Comment, NewComment, Post} from '../models/post';
import {ResponseBody} from '../models/responseBody';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient)

  addPost(newPost: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>('http://localhost:3000/posts', {
      ...newPost,
      date: new Date().toISOString(),
      comments: [],
      likes: 0
    });
  }

  // getPosts(): Observable<Post[]> {
  //   return this.http.get<Post[]>('http://localhost:3000/posts');
  // }

  getPosts(page: number, per_page: number): Observable<ResponseBody<Post[]>> {
    return this.http.get<ResponseBody<Post[]>>(`http://localhost:3000/posts?_page=${page}&_per_page=${per_page}`)
  }

  likePost(post: Post): Observable<Post> {
    return this.http.patch<Post>(`http://localhost:3000/posts/${post.id}`, {
      likes: post.likes + 1,
    });
  }

  likeComment(updatedPost: Post, commentId: number): Observable<Post> {
    const updatedComments = updatedPost.comments.map((comment: Comment) => {
      if (comment.id === commentId) {
        return { ...comment, likes: (comment.likes || 0) + 1 };
      }
      return comment;
    })

    return this.http.patch<Post>(`http://localhost:3000/posts/${updatedPost.id}`, {
      comments: updatedComments
    });
  }

  addComment(post: Post, newComment: string): Observable<Post> {
    const comment = {
      id: Date.now(),
      text: newComment,
      date: new Date(),
      likes: 0
    };

    // Append the new comment to the existing comments
    const updatedComments = post.comments ? [...post.comments, comment] : [comment];

    // Patch the post with the updated comments array
    return this.http.patch<Post>(`http://localhost:3000/posts/${post.id}`, { comments: updatedComments });
  }
}
