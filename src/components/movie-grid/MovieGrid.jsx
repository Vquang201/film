import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import './movie-grid.scss';
import MovieCard from '../movie-card/MovieCard';
import Button, { OutlineButton } from '../button/Button';
import Input from '../input/Input'
import tmdbApi, { category, movieType, tvType } from '../../api/tmdbApi';

const MovieGrid = props => {

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const { keyword } = useParams();
    // keyword là những từ mình tìm kiếm , khi không tìm kiếm mà bấm loadmore thì sẽ là undefined
    

    useEffect(() => {
        const getList = async () => {
            let response = null ;
            if (keyword === undefined) {
                const params = {};
                switch(props.category) {
                    case category.movie:
                        // Nếu click vào nav Movie thì => 
                        response = await tmdbApi.getMoviesList(movieType.upcoming, {params});
                        console.log("Respone MovieGrid in upcoming")
                        console.log({response})
                        break;
                    default:
                        // Ngược lại click vào TV Movie =>
                        response = await tmdbApi.getTvList(tvType.popular, {params});
                        console.log("Respone MovieGrid in popular")
                        console.log({response})
                }
                
            } else {
                const params = {
                    query: keyword
                }
                response = await tmdbApi.search(props.category, {params});
                // this here : tìm những props.category , với keyword mình đã search 
                console.log('response khi bấm search keyword ')
                console.log({response})
            }
    
            setItems(response.results);
            setTotalPage(response.total_pages);
        }
        getList();
        console.log(`props.category`)
        console.log(props.category)
    }, [props.category, keyword]);

    const loadMore = async () => {
        console.log({keyword})
        let response = null;
        if (keyword === undefined) {
            const params = {
                page: page + 1
            };
            switch(props.category) {
                case category.movie:
                    response = await tmdbApi.getMoviesList(movieType.upcoming, {params});
                    break;
                default:
                    response = await tmdbApi.getTvList(tvType.popular, {params});
            }
        } else {
            const params = {
                page: page + 1,
                query: keyword
            }
            response = await tmdbApi.search(props.category, {params});
        }
        setItems([...items, ...response.results]);
        setPage(page + 1);
    }

    return (
        <div>
            <div className="section mb-3">
                <MovieSearch category={props.category} keyword={keyword}/>
            </div>
            <div className="movie-grid">
                {
                    items.map((item, i) => <MovieCard category={props.category} item={item} key={i}/>)
                }
            </div>
            {
                page < totalPage ? (
                    <div className="movie-grid__loadmore">
                        <OutlineButton className="small" onClick={loadMore}>Load more</OutlineButton>
                    </div>
                ) : null
            }
        </div>
    );
}

const MovieSearch = props => {

    const history = useHistory();

    const [keyword, setKeyword] = useState(props.keyword ? props.keyword : '');

    const goToSearch = useCallback(() => {
            if (keyword.trim().length > 0) {
                history.push(`/${category[props.category]}/search/${keyword}`);
            }
        },
        [keyword, props.category, history]
    );

    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                goToSearch();
            }
        }
        document.addEventListener('keyup', enterEvent);
        return () => {
            document.removeEventListener('keyup', enterEvent);
        };
    }, [keyword, goToSearch]);

    return (
        <div className="movie-search">
            <Input
                type="text"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button className="small" onClick={goToSearch}>Search</Button>
        </div>
    )
}

export default MovieGrid;
