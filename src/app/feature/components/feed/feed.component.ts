import {Component, inject, OnInit, signal} from '@angular/core';
import {PostComponent} from '../../../shared/components/post/post.component';
import {PostsStore} from '../../../shared/state/posts.store';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputTextarea} from 'primeng/inputtextarea';
import {Textarea} from 'primeng/textarea';
import {FormsModule} from '@angular/forms';
import {PrimeTemplate} from 'primeng/api';
import {Skeleton} from 'primeng/skeleton';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Scroller, ScrollerLazyLoadEvent} from 'primeng/scroller';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-feed',
  imports: [
    PostComponent,
    Divider,
    Button,
    Dialog,
    InputTextarea,
    Textarea,
    FormsModule,
    PrimeTemplate,
    Skeleton,
    ProgressSpinner,
    Scroller,
    NgClass
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  protected readonly postsStore = inject(PostsStore);
  protected newPostTitle = signal('');
  protected newPostText = signal('');

  protected createPost() {
    if (this.newPostText()) {
      this.postsStore.addPost({
        title: this.newPostTitle(),
        text: this.newPostText(),
        date: new Date().toISOString(),
        likes: 0,
        comments: []
      });

      this.newPostTitle.set('');
      this.newPostText.set('');
    }
  }

  loadMore() {
    this.postsStore.nextPage()
  }

  showLess() {
    this.postsStore.prevPage()
  }
}
