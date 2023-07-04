import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, pipe } from 'rxjs';

interface Post {
  content: string;
  title: string;
  id: string;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'http-angular';
  addPostForm: FormGroup;
  loadedPosts = [];

  constructor(private http: HttpClient) {
    this.addPostForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.fetchPosts();

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
    this.http
      .post(
        'https://angular-project-dba2c-default-rtdb.firebaseio.com/post.json',
        this.addPostForm.value
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
    console.log(this.addPostForm.value);
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  private fetchPosts(){
    this.http.get('https://angular-project-dba2c-default-rtdb.firebaseio.com/post.json').pipe(map(responseData => {
      const postsArr = [];

      for(const key in (responseData)){
        if (responseData.hasOwnProperty(key)) {
          postsArr.push({...responseData[key], id:key});
        }
      }

      return postsArr;

    })).subscribe(posts => {
     
      console.log(posts);
      
    });
  }
}
