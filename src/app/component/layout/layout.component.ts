import { AuthService } from './../../services/auth-service.service';
import { Router } from '@angular/router';
import { FilterCar } from './../../models/FilterCar.model';
import { Lookups } from './../../models/Lookups.model';
import { BackendService } from './../../services/backend.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  generalSearchText: String;
  generalSearchCategory: String;

  suggestedCars: FilterCar[];
  lookups: Lookups;

  localStorageLastSeenCars = Array<{ carId: string, image: string }>();

  constructor(private router: Router, private backendService: BackendService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getSuggestedCars();
    this.getLookUps();


    let localStorageLastSeenCarsAsString = localStorage.getItem("lastSeenCars");

    if (localStorageLastSeenCarsAsString) {
      this.localStorageLastSeenCars = JSON.parse(localStorageLastSeenCarsAsString);
    }
  }

  generalCategorySearch() {
    if (this.generalSearchCategory && this.generalSearchText) {
      let param = {};
      param["searchText"] = this.generalSearchText
      if (this.generalSearchCategory != 'all') {
        param["category"] = this.generalSearchCategory
      }

      this.router.navigate(['filter'], { queryParams: param });
    }
  }

  getLookUps() {
    let url = `lookup`;
    this.backendService.ViewEntities(url).subscribe((response: any) => {
      this.lookups = response;

    });
  }

  getSuggestedCars() {
    let url = `suggestedCar`;
    let param = { "count": 2 }

    this.backendService.ViewEntities(url, param).subscribe((response: any) => {
      this.suggestedCars = response;
    });

  }

  isAuthenticated() {
    return this.authService.isTokenExistAndNotExipired();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
