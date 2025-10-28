import { Component, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-layout',
  imports: [ButtonModule],
  templateUrl: './layout.html',
})
export default class Layout implements OnInit {
  ngOnInit(): void {}
}
