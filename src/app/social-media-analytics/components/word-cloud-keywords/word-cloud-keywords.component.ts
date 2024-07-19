import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WordCloudItem } from '../../../shared/types';

declare var $: any;

@Component({
  selector: 'word-cloud-keywords',
  templateUrl: './word-cloud-keywords.component.html',
  styleUrl: './word-cloud-keywords.component.scss'
})

export class WordCloudSm2Component implements OnChanges {
  @Input() title!: string;
  @Input("data") wordCloudData: any;
  wordList!: WordCloudItem[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['wordCloudData']) {
      const wordList: WordCloudItem[] = this.wordCloudData.map((item: any) => ({
        word: item.identified_keyword,
        weight: (item.count)*3
      }));

      $("#wordCloud-2").jQWCloud({
        words: wordList,
        maxFont: 50,
        minFont: 10,
        verticalEnabled: false,
        padding_left: 10,
        word_click: function (event: any) {
          console.log(event.target.textContent);
        },
        word_mouseOver: function () { },
        word_mouseEnter: function () { },
        word_mouseOut: function () { },
        beforeCloudRender: function () { },
        afterCloudRender: function () { }
      });
    }
  }
}