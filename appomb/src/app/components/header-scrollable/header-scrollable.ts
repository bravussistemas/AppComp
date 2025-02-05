import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

function addStyleInDocument(doc, css) {
  const head = doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');
  style.type = 'text/css';
  style.appendChild(doc.createTextNode(css));
  head.appendChild(style);
}

@Directive({
  selector: '[header-scrollable]',
  host: {
    '(ionScroll)': 'onContentScroll($event)',
  },
})
export class HeaderScrollableDirective implements OnInit {
  @Input('header-scrollable') header;
  @Input() headerHeight = 56;
  headerEl: Element;
  toolbar: Element;
  scrollEl: Element;
  toolbarTitle: Element;

  titleProportion = 3;

  get titlePosition(): number {
    return this.headerHeight * this.titleProportion;
  }

  constructor(public el: ElementRef, public render: Renderer2) {
  }

  ngOnInit() {
    const css = `.scroll-content.scroll-fancy {
      margin-top: 0 !important;
    }`;
    addStyleInDocument(document, css);
    this.headerEl = this.header;
    this.toolbar = this.headerEl.querySelector('.toolbar-background');
    this.toolbarTitle = this.headerEl.querySelector('.toolbar-content .title');
    this.render.addClass(this.headerEl, 'shadowless');
    this.render.setStyle(this.toolbar, 'height', `${0}px`);
    this.render.setStyle(this.toolbarTitle, 'margin-top', `-${this.titlePosition}px`);
    this.render.setStyle(this.toolbarTitle, 'opacity', `0`);
    this.scrollEl = this.el.nativeElement.querySelector('.scroll-content');
    this.render.addClass(this.scrollEl, 'scroll-fancy');
  }

  canShowHeader() {
    const diff = this.scrollEl.scrollHeight - this.el.nativeElement.clientHeight;
    return diff >= this.headerHeight
  }

  onContentScroll(event) {
    if (!this.canShowHeader()) {
      return;
    }
    let scrollTop = event.scrollTop;
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    if (scrollTop > this.headerHeight) {
      scrollTop = this.headerHeight;
    }
    const percent = scrollTop / this.headerHeight;
    const titleMarginTop = -this.titlePosition + (scrollTop * this.titleProportion);
    this.render.setStyle(this.toolbar, 'height', `${scrollTop}px`);
    this.render.setStyle(this.toolbarTitle, 'margin-top', `${titleMarginTop}px`);
    this.render.setStyle(this.toolbarTitle, 'opacity', `${percent}`);
    if (scrollTop >= this.headerHeight) {
      this.render.removeClass(this.headerEl, 'shadowless');
    } else {
      this.render.addClass(this.headerEl, 'shadowless');
    }
  }

}
