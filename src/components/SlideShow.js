import React, { Component, Fragment } from 'react';
import Event from './utils/Event';
import Magnifier from './utils/Magnifier';
import Gallery from './utils/Gallery';

export default class ReactSlickExample extends Component {
    componentDidMount() {
        const evt = new Event({});
        const m = new Magnifier(evt, {
            largeWrapper: document.getElementById('gallery-preview')
        });

        const imageData = [
            {
                title: 'Downy Woodpecker',
                thumb: 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/112_Downy_Woodpecker.jpg/250px-112_Downy_Woodpecker.jpg',
                large: 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/112_Downy_Woodpecker.jpg/1000px-112_Downy_Woodpecker.jpg',
                url: 'http://commons.wikimedia.org/wiki/File:112_Downy_Woodpecker.jpg'
            },
            {
                title: 'Hooded Warbler',
                thumb: 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/110_Hooded_Warbler.jpg/250px-110_Hooded_Warbler.jpg',
                large: 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/110_Hooded_Warbler.jpg/1000px-110_Hooded_Warbler.jpg',
                url: 'http://commons.wikimedia.org/wiki/File:110_Hooded_Warbler.jpg'
            },
            {
                title: 'Pileated Woodpecker',
                thumb: 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/111_Pileated_Woodpecker.jpg/250px-111_Pileated_Woodpecker.jpg',
                large: 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/111_Pileated_Woodpecker.jpg/1000px-111_Pileated_Woodpecker.jpg',
                url: 'http://commons.wikimedia.org/wiki/File:111_Pileated_Woodpecker.jpg'
            },
            {
                title: 'Bluebird',
                thumb: 'http://upload.wikimedia.org/wikipedia/commons/thumb/5/51/113_Blue-bird.jpg/250px-113_Blue-bird.jpg',
                large: 'http://upload.wikimedia.org/wikipedia/commons/thumb/5/51/113_Blue-bird.jpg/1000px-113_Blue-bird.jpg',
                url: 'http://commons.wikimedia.org/wiki/File:113_Blue-bird.jpg'
            },
            {
                title: 'Wood Pewee',
                thumb: 'http://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/115_Wood_Pewee.jpg/250px-115_Wood_Pewee.jpg',
                large: 'http://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/115_Wood_Pewee.jpg/1000px-115_Wood_Pewee.jpg',
                url: 'http://commons.wikimedia.org/wiki/File:115_Wood_Pewee.jpg'
            },
            {
                title: 'Blue Grosbeak',
                thumb: 'http://upload.wikimedia.org/wikipedia/commons/thumb/1/11/122_Blue_Grosbeak.jpg/250px-122_Blue_Grosbeak.jpg',
                large: 'http://upload.wikimedia.org/wikipedia/commons/thumb/1/11/122_Blue_Grosbeak.jpg/1000px-122_Blue_Grosbeak.jpg',
                url: 'http://commons.wikimedia.org/wiki/File:122_Blue_Grosbeak.jpg'
            },
            {
                title: 'Cat Bird',
                thumb: 'http://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/128_Cat_Bird.jpg/250px-128_Cat_Bird.jpg',
                large: 'http://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/128_Cat_Bird.jpg/1000px-128_Cat_Bird.jpg',
                url: 'http://commons.wikimedia.org/wiki/File:128_Cat_Bird.jpg'
            }
        ];

       new Gallery(evt, m, {
            gallery: document.getElementById('gallery'),
            images: imageData,
            prev: document.getElementById('gallery-prev'),
            next: document.getElementById('gallery-next'),
            previewText: document.getElementById('gallery-preview-title')
        });
    }

    render() {
        return (
            <div class="gallery">
                <div class="slider">
                    <ul id="gallery"></ul>
                </div>
                <div class="magnifier-preview" id="gallery-preview">
                    <div class="heading">Birds of America</div>
                    <div class="title" id="gallery-preview-title">&nbsp;</div>
                    <div class="author">by John James Audubon</div>
                </div>
                <div class="btn-wrapper">
                    <button class="prev" id="gallery-prev">&lt;</button>
                    <button class="next" id="gallery-next">&gt;</button>
                </div>
            </div>
        )
    }
}