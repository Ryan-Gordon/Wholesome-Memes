import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RedditApiProvider } from '../../providers/reddit-api/reddit-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RedditApiProvider]
})
export class HomePage {loadCompleted: boolean = false;
  subreddit;

  posts: Array<any>;

  constructor(public navCtrl: NavController, public redditApi: RedditApiProvider, public navParams: NavParams) {
    this.subreddit = this.navParams.get('subreddit');
    this.load('wholesomememes'); //atm we only want the wholesomememes subreddit
  }
  //takes an optional param of url to try and load a subreddits posts, no url defaults to front page
  load(url?) {
    this.redditApi.fetch(url).subscribe((posts) => {
      this.posts = posts;
      this.loadCompleted = true;
      console.log(posts)
    })
  }

  getPostImage(post) {
   let postImage = '';
   if (!post.imageError && post.preview) {
     postImage = post.preview.images[0].source.url;
   }
   return postImage;
  }

  setImageError(post) {
    post.imageError = true;
  }

  readPost(post) {
    let redditUrl = 'https://www.reddit.com/r/';
    if (post.url.includes(redditUrl)) {
      //this.goToComments(post)
    } else {
      this.goToPost(post);
    }
  }
/*
  goToComments(post) {
    this.navCtrl.push(this.commentsPage, {post})
  }
*/
  goToPost(post) {
    window.open(post.url, '_blank');
  }
/*
  goToSubreddit(subreddit) {
    this.navCtrl.push(PostsPage, {subreddit})
  }
*/
  loadMore(infiniteScroll) {
    let lastPost = this.posts[this.posts.length - 1];
    if (!lastPost) {
      infiniteScroll.complete()
    } else {
      this.redditApi.fetchNext(lastPost.name, this.subreddit).subscribe((posts) => {
        this.posts = this.posts.concat(posts);
        infiniteScroll.complete();
      })
    }
  }
}