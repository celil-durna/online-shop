import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductGridItemComponent } from '../product-grid-item/product-grid-item.component';
import { ButtonModule } from 'primeng/button';
import { Component, HostListener } from '@angular/core';
import { Color } from '../services/color';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductItemComponent, ProductGridItemComponent, ButtonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent {

  products!: Product[];
  viewMode: 'list' | 'grid' = 'list';

  chunkSize = 15; // how many products are loaded additionally
  isLoading = false;
  allProductsLoaded = false;

  brandsFiltered: string[] = [];
  colorsFiltered: string[] = [];
  typesFiltered: string[] = [];
  defaultMaxPrice: number = 200; // default max price
  maxPrice = this.defaultMaxPrice;
  priceRange: number = 200;
  filtersVisible = false;
  isMobile = window.innerWidth < 768;
  currentFilterPage = 0;
  currentUnfilteredPage = 0;


  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  // populate filters
  brandList: string[] = [];
  colorList: Color[] = [];
  typeList: string[] = [];

  searchTerm: string = '';

  constructor(private router: Router, private productService: ProductService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkScreenSize();
        if (this.brandList.length === 0 || this.typeList.length === 0 || this.colorList.length === 0) {
          this.loadFilters();
          this.applyFilters();
        }
      });

  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    console.log('isMobile set to:', this.isMobile, 'Width:', window.innerWidth);
  }


  ngOnInit(): void {
    this.checkScreenSize();
    this.loadInitialProducts();
    this.loadFilters();
    this.applyFilters();
  }


  ngOnDestroy(): void {
  }


  loadInitialProducts() {
    this.isLoading = true;
    this.productService.getInitialProductMetadata(this.chunkSize)
      .subscribe(
        (products) => {
          this.products = products;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error while loading products:', error);
          this.isLoading = false;
        }
      );
  }

  loadMoreProducts() {
    this.isLoading = true;

    this.productService.getNextProductMetadata(this.chunkSize)
      .subscribe(
        (newProducts) => {
          if (newProducts.length === 0) {
            // if no products anymore, then we dont want the button to load more
            this.allProductsLoaded = true;
          } else {
            this.products = [...this.products, ...newProducts];
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 600);
        },
        (error) => {
          console.error('Error while loading new products:', error);
          this.isLoading = false;
        }
      );
  }

  toggleView(mode: 'list' | 'grid') {
    this.viewMode = mode;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const threshold = 100;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;

    if (
      !this.isLoading &&
      !this.allProductsLoaded &&
      position >= height - threshold
    ) {
      if (this.hasActiveFilters()) {
        this.loadMoreFilteredProducts();
      } else {
        this.loadMoreProducts();
      }
    }
  }

  // Filter Side Bar
  loadFilters() {
    this.productService.getBrandList().subscribe(data => {
      this.brandList = data
        .filter(brand => brand && brand.trim() !== '')
        .sort(); // enforce alphabetical order again
    });

    this.productService.getColorsList().subscribe(data => this.colorList = data);
    this.productService.getTypeList().subscribe(data => this.typeList = data);
  }

  applyFilters() {
    this.currentFilterPage = 0;
    this.allProductsLoaded = false;

    this.productService.getInitialProductMetadata(
      this.chunkSize,
      undefined,
      this.searchTerm.trim(),
      this.brandsFiltered,
      [],
      this.typesFiltered,
      [],
      this.colorsFiltered,
      [],
    ).subscribe(products => {
      const filtered = this.maxPrice !== this.defaultMaxPrice
        ? products.filter(p => p.price <= this.maxPrice)
        : products;

      this.products = filtered;

      if (filtered.length < this.chunkSize) {
        this.allProductsLoaded = true;
      }
    });
  }

  loadMoreFilteredProducts() {
    this.isLoading = true;

    this.productService.getNextProductMetadata(this.chunkSize)
      .subscribe(newProducts => {
        const filtered = this.maxPrice !== this.defaultMaxPrice
          ? newProducts.filter(p => p.price <= this.maxPrice)
          : newProducts;

        this.products = [...this.products, ...filtered];

        if (filtered.length < this.chunkSize) {
          this.allProductsLoaded = true;
        }

        this.isLoading = false;
      }, error => {
        console.error('Error while loading filtered products:', error);
        this.isLoading = false;
      });
  }

  onBrandChange(event: any) {
    this.updateFilterList(this.brandsFiltered, event);
    if (!this.isMobile) this.applyFilters(); // apply immediately on desktop
  }

  onTypeChange(event: any) {
    this.updateFilterList(this.typesFiltered, event);
    if (!this.isMobile) this.applyFilters();
  }

  toggleColor(colorName: string) {
    const index = this.colorsFiltered.indexOf(colorName);
    if (index > -1) {
      this.colorsFiltered.splice(index, 1);
    } else {
      this.colorsFiltered.push(colorName);
    }
    if (!this.isMobile) this.applyFilters();
  }

  onPriceChange() {
    if (!this.isMobile) this.applyFilters();
  }

  updateFilterList(list: string[], event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      list.push(value);
    } else {
      const index = list.indexOf(value);
      if (index > -1) list.splice(index, 1);
    }
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return (
      this.brandsFiltered.length > 0 ||
      this.colorsFiltered.length > 0 ||
      this.typesFiltered.length > 0 ||
      this.searchTerm.trim() !== '' ||
      this.maxPrice !== this.defaultMaxPrice
    );
  }

  applyFiltersFromSidebar() {
    this.filtersVisible = false;
    this.applyFilters();
    window.scrollTo({ top: 0 });
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  clearPriceFilter() {
    this.maxPrice = this.priceRange;
    this.applyFilters();
  }

  removeFilter(filterType: string, value: string) {
    switch (filterType) {
      case 'brand':
        this.brandsFiltered = this.brandsFiltered.filter(b => b !== value);
        break;
      case 'color':
        this.colorsFiltered = this.colorsFiltered.filter(c => c !== value);
        break;
      case 'type':
        this.typesFiltered = this.typesFiltered.filter(t => t !== value);
        break;
    }
    this.applyFilters();
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.brandsFiltered = [];
    this.colorsFiltered = [];
    this.typesFiltered = [];
    this.maxPrice = this.defaultMaxPrice;

    this.applyFilters();
  }

  resetPrice() {
    this.maxPrice = this.defaultMaxPrice;
    this.applyFilters();
  }
}
