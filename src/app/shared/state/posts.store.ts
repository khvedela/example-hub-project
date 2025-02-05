import { Post } from "../models/post"
import {patchState, signalStore, withComputed, withMethods, withProps, withState} from '@ngrx/signals';
import {computed, inject} from '@angular/core';
import {PostService} from '../services/post.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {MessageService} from 'primeng/api';
import {rxResource} from '@angular/core/rxjs-interop';
import {ResponseBody} from '../models/responseBody';

interface Pagination {
  page: number;
  per_page: number;
}

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: Error | null;
  pagination: Pagination
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: 2,
  }
}

export const PostsStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withProps((store, postService=inject(PostService)) => {
    return {
      fetchPosts: rxResource<ResponseBody<Post[]>, Pagination>({
        request: store.pagination,
        loader: (params) => {
          const { request: pagination, abortSignal } = params
          return postService.getPosts(pagination.page, pagination.per_page)
            .pipe(
              tap((posts: ResponseBody<Post[]>) => patchState(store, {
                posts: posts.data,
              }))
            )
        }
      }),
      // _addPost: rxResource()
    }
  }),
  withComputed(({ pagination, fetchPosts }) => ({
    // posts: computed(() => fetchPosts.value()?.data || []), // '?' გვინდა იმიტომ, რომ თავდაპირველად არის undefined რასაც თავს ვერ ვარიდებთ
    totalItems: computed(() => fetchPosts.value()?.items || 1),
  })),
  withMethods((store, postService=inject(PostService), messageService=inject(MessageService)) => ({
    nextPage: () => {
      patchState(store, { pagination: {
          page: 1,
          per_page: store.pagination().per_page > store.totalItems() ? store.totalItems() : store.pagination().per_page + 1,
        }
      })
    },
    prevPage: () => {
      patchState(store, { pagination: {
          page: 1,
          per_page: store.pagination().per_page > 0 ?store.pagination().per_page - 1 : 1,
        }
      })
    },
    addPost: rxMethod<Omit<Post, 'id'>>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((newPost) => postService.addPost(newPost).pipe(
          tapResponse({
            next: (createdPost) => {
              patchState(store, {
                isLoading: false,
                posts: [createdPost, ...store.posts()]
              });
              messageService.add({
                severity: 'success',
                summary: 'Post created successfully!',
                life: 3000
              });
            },
            error: (error: Error) => {
              patchState(store, { isLoading: false, error });
              messageService.add({
                severity: 'error',
                summary: 'Failed to create post',
                detail: error.message,
                life: 5000
              });
            }
          })
        ))
      )
    ),

    // loadPosts: rxMethod<void>(
    //   pipe(
    //     tap(() => patchState(store, { isLoading: true })),
    //     switchMap(() => postService.getPosts(1).pipe(
    //       tapResponse({
    //         next: (posts: Post[]) => patchState(store, { isLoading: false, posts}),
    //         error: (error: Error) => patchState(store, { isLoading: false, error }),
    //       })
    //     ))
    //   )
    // ),

    likePost: rxMethod<Post>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((post: Post) => postService.likePost(post).pipe(
          tapResponse({
            next: (updatedPost: Post) => {
              patchState(store, {
                isLoading: false,
                posts: store.posts().map(post => post.id === updatedPost.id ? updatedPost : post),
              })
              messageService.add({
                severity: 'info',
                summary: 'You liked a post !',
                life: 3000
              })
            },
            error: (error: Error) => patchState(store, { isLoading: false, error }),
          })
        ))
      )
    ),

    likeComment: rxMethod<{ post: Post, commentId: number }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ post, commentId }) => postService.likeComment(post, commentId).pipe(
          tapResponse({
            next: (updatedPost: Post) => {
              patchState(store, {
                isLoading: false,
                posts: store.posts().map(post => post.id === updatedPost.id ? updatedPost : post),
              })
              messageService.add({
                severity: 'info',
                summary: 'You liked a comment !',
                life: 3000
              })
            },
            error: (error: Error) => patchState(store, { isLoading: false, error }),
          })
        ))
      )
    ),

    addComment: rxMethod<{ post: Post, commentText: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ post, commentText }) =>
          postService.addComment(post, commentText).pipe(
            tapResponse({
              next: (updatedPost: Post) => {
                patchState(store, {
                  isLoading: false,
                  posts: store.posts().map(p => p.id === updatedPost.id ? updatedPost : p),
                });
                messageService.add({
                  severity: 'success',
                  summary: 'Comment added!',
                  life: 3000
                });
              },
              error: (error: Error) => patchState(store, { isLoading: false, error }),
            })
          )
        )
      )
    )
  }))
)

