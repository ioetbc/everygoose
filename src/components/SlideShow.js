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

        console.log('slideshowImages', this.props.slideshowImages)

        const imageData = [
            {
                title: 'Downy Woodpecker',
                thumb: 'https://images.prismic.io/everygoose/59973431-0d31-4d9c-84f2-570f36d9614e_P-019-S.jpg?auto=compress,format',
                large: 'https://images.prismic.io/everygoose/59973431-0d31-4d9c-84f2-570f36d9614e_P-019-S.jpg?auto=compress,format',
                url: 'http://commons.wikimedia.org/wiki/File:112_Downy_Woodpecker.jpg',
                height: '540px'
            },
            {
                title: 'Hooded Warbler',
                thumb: 'https://images.prismic.io/everygoose/c06ff919-1874-40c7-893f-ad87ca7a5551_P-018.jpg?auto=compress,format',
                large: 'https://images.prismic.io/everygoose/c06ff919-1874-40c7-893f-ad87ca7a5551_P-018.jpg?auto=compress,format',
                url: 'http://commons.wikimedia.org/wiki/File:110_Hooded_Warbler.jpg',
                height: '617px'
            },
            {
                title: 'Pileated Woodpecker',
                thumb: '/static/media/card-portrait-inside.45aa4c03.jpg',
                large: '/static/media/card-portrait-inside.45aa4c03.jpg',
                url: 'http://commons.wikimedia.org/wiki/File:111_Pileated_Woodpecker.jpg',
                height: '300px'
            },
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
                <div class="btn-wrapper">
                    <button class="prev" id="gallery-prev">&lt;</button>
                    <button class="next" id="gallery-next">&gt;</button>
                </div>
            </div>
        )
    }
}