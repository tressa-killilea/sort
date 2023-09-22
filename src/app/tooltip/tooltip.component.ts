import { Component } from '@angular/core';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  popper: any;
  button?: HTMLElement;
  content?: HTMLElement;

  ngAfterViewInit() {
    this.button = document.querySelector('#tooltip-button') as HTMLElement;
    this.content = document.querySelector('#tooltip-content') as HTMLElement;
    if (this.button !== null && this.content !== null) {
      this.popper = createPopper(this.button, this.content, {
        placement: 'bottom-start',
      });
    }

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    showEvents.forEach((event) => {
      this.button?.addEventListener(event, () => {
        this.content?.setAttribute('data-show', '');
        this.popper.setOptions((options: any) => ({
          ...options,
          modifiers: [
            ...options.modifiers,
            { name: 'eventListeners', enabled: true },
          ],
        }));
      });
    });

    hideEvents.forEach((event) => {
      this.button?.addEventListener(event, () => {
        this.content?.removeAttribute('data-show');
        this.popper.setOptions((options: any) => ({
          ...options,
          modifiers: [
            ...options.modifiers,
            { name: 'eventListeners', enabled: false },
          ],
        }));
      });
    });
  }
}
