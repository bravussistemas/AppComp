import { Directive, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: '[parallax-header]',
  host: {
    '(ionScroll)': 'onContentScroll($event)',
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class ParallaxHeader {

    header: any;
    headerHeight: any;
    translateAmt: any;
    scaleAmt: any;

    constructor(public element: ElementRef, public renderer: Renderer2){

    }

    ngOnInit(){

        let content = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
        this.header = content.getElementsByClassName('header-image')[0];
        let mainContent = content.getElementsByClassName('main-content')[0];

        this.headerHeight = this.header.clientHeight;

        this.renderer.setStyle(this.header, 'webkitTransformOrigin', 'center bottom');
        this.renderer.setStyle(this.header, 'background-size', 'cover');
        this.renderer.setStyle(mainContent, 'position', 'absolute');

    }

    onWindowResize(ev){
        this.headerHeight = this.header.clientHeight;
    }

    onContentScroll(ev){

        ev.domWrite(() => {
            this.updateParallaxHeader(ev);
        });

    }

    updateParallaxHeader(ev){

        if(ev.scrollTop >= 0){
            this.translateAmt = ev.scrollTop / 2;
            this.scaleAmt = 1;
        } else {
            this.translateAmt = 0;
            this.scaleAmt = -ev.scrollTop / this.headerHeight + 1;
        }

        this.renderer.setStyle(this.header, 'webkitTransform', 'translate3d(0,'+this.translateAmt+'px,0) scale('+this.scaleAmt+','+this.scaleAmt+')');

    }

}