import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  createAndStorePosts(postContent: Post) {
    const postData: Post = postContent;

    this.http
      .post<{ name: string }>(
        'https://angular-project-dba2c-default-rtdb.firebaseio.com/post.json',
        postData
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angular-project-dba2c-default-rtdb.firebaseio.com/post.json'
      )
      .pipe(
        map((responseData) => {
          const postsArr: Post[] = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArr.push({ ...responseData[key], id: key });
            }
          }
          return postsArr;
        })
      )
  }
}
