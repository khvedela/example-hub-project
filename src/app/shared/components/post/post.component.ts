import {Component, inject, Input, linkedSignal, signal} from '@angular/core';
import {Post, Comment} from '../../models/post';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {Button} from 'primeng/button';
import {PostsStore} from '../../state/posts.store';
import {Divider} from 'primeng/divider';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {IftaLabel} from 'primeng/iftalabel';

@Component({
  selector: 'app-post',
  imports: [
    Card,
    PrimeTemplate,
    DatePipe,
    Button,
    Divider,
    FormsModule,
    InputText,
    IftaLabel
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post!: Post;

  newCommentText = linkedSignal({
    source: () => this.post,
    computation: () => ''
  });

  protected readonly postStore = inject(PostsStore);

  showAllComments = signal(false);

  toggleComments(): void {
    this.showAllComments.update(v => !v);
  }

  get highestComment(): Comment | null {
    const comments = this.post?.comments;
    if (!comments || comments.length === 0) return null;
    return comments.reduce((prev, current) => current.likes > prev.likes ? current : prev);
  }

  get otherComments(): Comment[] {
    const comments = this.post?.comments;
    if (!comments || comments.length <= 1) return [];
    return comments.filter(comment => comment.id !== this.highestComment?.id);
  }

  onLikePost(): void {
    this.postStore.likePost(this.post);
  }

  onLikeComment(comment: Comment): void {
    this.postStore.likeComment({
      post: this.post,
      commentId: comment.id
    });
  }

  onAddComment(post: Post) {
    if (this.newCommentText().trim()) {
      this.postStore.addComment({ post, commentText: this.newCommentText() });
      this.newCommentText.set('');
    }
  }
}
