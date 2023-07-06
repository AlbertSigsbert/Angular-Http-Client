import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'http-angular';
  addPostForm: FormGroup;
  loadedPosts:Post[] = [];
  isFetching = false;
  error:null | any = null;
  private errorSub: Subscription;

  constructor(private postsService:PostsService) {
    this.addPostForm = new FormGroup({});
    this.errorSub = new Subscription;
  }

  ngOnInit(): void {
    this.errorSub = this.postsService.error.subscribe(errorMessage =>{
      this.error = errorMessage;
    })

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe({
      next: (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      error: (error) => {
        this.error = error.message;
      },
    });

    this.addPostForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      content: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  onCreatePost() {
    this.postsService.createAndStorePosts(this.addPostForm.value);  
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe({
      next: (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }

  onClearPosts(){
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
