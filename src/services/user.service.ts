/**
 * @author Edgar Butwilowski
 * @copyright Copyright (c) Vermessungsamt Winterthur. All rights reserved.
 */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  private user: User = new User();

  private http: HttpClient;

  private jwtHelperService: JwtHelperService;

  private router: Router;

  public static userTokenName: string = environment.playgroundUserToken;

  constructor(http: HttpClient, jwtHelperService: JwtHelperService,
    router: Router) {
    this.http = http;
    this.jwtHelperService = jwtHelperService;
    this.router = router;

    let userTokenTemp = localStorage.getItem(UserService.userTokenName);
    let userToken: string = userTokenTemp !== null ? userTokenTemp : "";
    this.user = this.readUserFromToken(userToken);
  }

  getLocalUser(): User {
    return this.user;
  }

  login(user: User, successFunc: () => void, errorFunc: () => void) {
    let reqResult: Observable<any> = this.http.post(environment.apiUrl + '/account/login', user,
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }) as Observable<any>;
    reqResult.subscribe(userToken => {
      // success:
      successFunc();
      this.clearLocalUser();
      localStorage.setItem(UserService.userTokenName, userToken.securityTokenString);
      this.user = this.readUserFromToken(userToken.securityTokenString);
    },
    error => {
      errorFunc();
    });
  }

  logout() {
    this.clearLocalUser();
  }

  public isUserLoggedIn(): boolean {
    let userTokenTemp = localStorage.getItem(UserService.userTokenName);
    let userToken: string = userTokenTemp !== null ? userTokenTemp : "";
    if (this.user.mailAddress !== "" && userToken !== "" && !this.jwtHelperService.isTokenExpired(userToken)) {
      return true;
    } else {
      return false;
    }
  }

  clearLocalUser() {
    this.user.firstName = "";
    this.user.lastName = "";
    this.user.initials = "";
    this.user.mailAddress = "";
    this.user.passPhrase = "";
    this.user.role = "";
    localStorage.clear();
  }

  canActivate() {
    let isUserLoggedIn: boolean = this.isUserLoggedIn();
    if (!isUserLoggedIn) {
      this.router.navigate(["login"]);
    }
    return isUserLoggedIn;
  }

  private readUserFromToken(userToken: string): User {
    let resultUser: User = new User();
    if (userToken !== null && "" !== userToken) {
      resultUser = new User();
      let tokenDecoded = this.jwtHelperService.decodeToken(userToken);
      resultUser.mailAddress = tokenDecoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      resultUser.firstName = tokenDecoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
      resultUser.lastName = tokenDecoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      resultUser.initials = "anonym";
      if (resultUser.lastName !== null && resultUser.lastName.length > 1) {
        resultUser.initials = resultUser.lastName[0].toUpperCase() + resultUser.lastName[1].toUpperCase();
      }
    }
    return resultUser;
  }


}
