/**
 * @author Edgar Butwilowski
 * @copyright Copyright (c) Vermessungsamt Winterthur. All rights reserved.
 */
 import { HttpClient } from '@angular/common/http';
 import { Component, OnInit } from '@angular/core';
 import { NgForm } from '@angular/forms';
 import { Router } from '@angular/router';
 import { PlaygroundService } from 'src/services/playgrounds.service';
 import { UserService } from 'src/services/user.service';
 import { User } from '../model/user';
 
 @Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
 })
 /**
  * The LoginComponent defines the interface for the user
  * login page of the playground web application.
  */
 export class LoginComponent implements OnInit {
 
   loginInvalid: boolean = false;
 
   private router: Router;
   private userService: UserService;
   private playgroundService: PlaygroundService;
 
   constructor(router: Router, http: HttpClient, userService: UserService,
     playgroundService: PlaygroundService) {
     this.router = router;
     this.userService = userService;
     this.playgroundService = playgroundService;
    }
 
   ngOnInit(): void {
   }
 
   loginUser(ngForm: NgForm){
 
     let user: User = new User();
     user.mailAddress = ngForm.value.loginname;
     user.passPhrase = ngForm.value.password;
 
     this.userService.login(user, 
          () => {
            // in the case of login success:
            this.loginInvalid = false;
            this.playgroundService.clearSelectedPlayground();
            this.router.navigate(["/"]);
          }, 
          () => {
            // in the case of login failure (error):
            this.loginInvalid = true;
          });
   }
 
 }
 