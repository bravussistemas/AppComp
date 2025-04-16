import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

function addStyleInDocument(doc: Document, css: string) {
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
export class HeaderScrollableDirective implements OnChanges {
  @Input('header-scrollable') header: HTMLElement;
  @Input() headerHeight = 56;

  headerEl: HTMLElement;
  toolbar: HTMLElement;
  scrollEl: HTMLElement;
  toolbarTitle: HTMLElement;

  titleProportion = 3;

  constructor(public el: ElementRef, public render: Renderer2) {}

  get titlePosition(): number {
    return this.headerHeight * this.titleProportion;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['header'] && this.header) {
      this.init();
    }
  }

  private init() {
    const css = `.scroll-content.scroll-fancy {
      margin-top: 0 !important;
    }`;
    addStyleInDocument(document, css);

    this.headerEl = this.header;
    this.toolbar = this.headerEl.querySelector('.toolbar-background');
    this.toolbarTitle = this.headerEl.querySelector('.toolbar-content .title');

    if (!this.toolbar || !this.toolbarTitle) {
      console.warn('Elementos do header não encontrados para animação.');
      return;
    }

    this.render.addClass(this.headerEl, 'shadowless');
    this.render.setStyle(this.toolbar, 'height', `0px`);
    this.render.setStyle(
      this.toolbarTitle,
      'margin-top',
      `-${this.titlePosition}px`
    );
    this.render.setStyle(this.toolbarTitle, 'opacity', `0`);

    this.scrollEl = this.el.nativeElement.querySelector('.scroll-content');
    if (this.scrollEl) {
      this.render.addClass(this.scrollEl, 'scroll-fancy');
    }
  }

  private canShowHeader() {
    if (!this.scrollEl) return false;
    const diff =
      this.scrollEl.scrollHeight - this.el.nativeElement.clientHeight;
    return diff >= this.headerHeight;
  }

  onContentScroll(event: any) {
    if (!this.canShowHeader()) return;

    let scrollTop = event.scrollTop;
    scrollTop = Math.max(0, Math.min(scrollTop, this.headerHeight));

    const percent = scrollTop / this.headerHeight;
    const titleMarginTop =
      -this.titlePosition + scrollTop * this.titleProportion;

    if (this.toolbar) {
      this.render.setStyle(this.toolbar, 'height', `${scrollTop}px`);
    }

    if (this.toolbarTitle) {
      this.render.setStyle(
        this.toolbarTitle,
        'margin-top',
        `${titleMarginTop}px`
      );
      this.render.setStyle(this.toolbarTitle, 'opacity', `${percent}`);
    }

    if (scrollTop >= this.headerHeight) {
      this.render.removeClass(this.headerEl, 'shadowless');
    } else {
      this.render.addClass(this.headerEl, 'shadowless');
    }
  }
}
