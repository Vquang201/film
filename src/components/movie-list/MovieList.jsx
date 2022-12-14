import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './movie-list.scss';
import { SwiperSlide, Swiper } from 'swiper/react';
import tmdbApi, { category } from '../../api/tmdbApi';
import MovieCard from '../movie-card/MovieCard';

const MovieList = props => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        const getList = async () => {
            let response = null;
            const params = {};

            if (props.type !== 'similar') {       
                switch(props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(props.type, {params});
                        console.log("Respone MovieList in (1) of Top Rated Movies ")
                        console.log({response})
                        break;
                    default:
                        response = await tmdbApi.getTvList(props.type, {params});
                        console.log("Respone MovieList in (2) of Trending TV")
                        console.log({response})
                }
            } else {
                response = await tmdbApi.similar(props.category, props.id);
                console.log("Respone MovieList in (3) of Top Rated TV")
                console.log({response})
            }
            setItems(response.results);
        }
        getList();
    }, []);

    return (
        <div className="movie-list">
            {/* swiper kéo slide trong home */}
            <Swiper
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={'auto'}
            >
                {
                    items.map((item, i) => (
                        <SwiperSlide key={i}>
                            <MovieCard item={item} category={props.category}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
}

MovieList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
    
}

export default MovieList;
