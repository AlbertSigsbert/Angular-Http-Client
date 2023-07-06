import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, map } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {

  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePosts(postContent: Post) {
    const postData: Post = postContent;

    this.http
      .post<{ name: string }>(
        'https://angular-project-dba2c-default-rtdb.firebaseio.com/post.json',
        postData
      )
      .subscribe({
        next:(responseData) => {
          console.log(responseData);
        },
        error:(e) => {
          this.error.next(e.message)
        }
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

  deletePosts(){
    return this.http.delete('https://angular-project-dba2c-default-rtdb.firebaseio.com/post.json');
  }
}
