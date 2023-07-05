import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'http-angular';
  addPostForm: FormGroup;
  loadedPosts:Post[] = [];
  isFetching = false;

  constructor(private http: HttpClient, private postsService:PostsService) {
    this.addPostForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;
      this.isFetching = false
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
    this.postsService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;
      this.isFetching = false
    });
  }

  onClearPosts(){
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
  }
}
