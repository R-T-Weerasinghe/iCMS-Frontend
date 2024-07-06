import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WordCloudItem } from '../../../shared/types';

declare var $: any;

@Component({
  selector: 'word-cloud-topics',
  templateUrl: './word-cloud-topics.component.html',
  styleUrl: './word-cloud-topics.component.scss'
})

export class WordCloudSmComponent implements OnChanges {
  @Input() title!: string;
  @Input("data") wordCloudData: any;
  wordList!: WordCloudItem[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['wordCloudData']) {
      const wordList: WordCloudItem[] = this.wordCloudData.map((item: any) => ({
        word: item.identified_product,
        weight: item.count
      }));

      $("#wordCloud-1").jQWCloud({
        words: wordList,
        maxFont: 50,
        minFont: 10,
        verticalEnabled: true,
        padding_left: null,
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