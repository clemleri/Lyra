import React from "react";
import { Carousel, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ArtistCard = ({ artist }) => {
    return (
        <Col md={2} className="d-flex flex-column align-items-center">
            {artist.images && artist.images.length > 0 ? (
                <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="img-fluid"
                    style={{ aspectRatio: '1 / 1', objectFit: 'cover', borderRadius : 100 }}
                />
            ) : (
                <div
                    className="bg-secondary rounded"
                    style={{ width: '100%', paddingTop: '100%' }}
                />
            )}
            <div className="fw-semibold mt-2 text-center">
                {artist.place}. {artist.name}
            </div>
            <div className="text-muted text-center small text-truncate" style={{ maxWidth: '100%' }}>
                {artist.genres.length > 0 ? artist.genres.join(', ') : ''}
            </div>
        </Col>
    );
};

const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
};

const TopArtistsCarousel = ({ artists }) => {
    // Ajout de la propriété "place" à chaque artiste
    const chunkedArtists = chunkArray(
        artists.map((a, i) => ({ ...a, place: i + 1 })),
        5
    );

    return (
        <Carousel>
            {chunkedArtists.map((group, index) => (
                <Carousel.Item key={index}>
                    <Row className="justify-content-center">
                        {group.map((artist, i) => (
                            <ArtistCard key={i} artist={artist} />
                        ))}
                    </Row>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

const TopArtists = ({ topArtists }) => {
    return (
        <div className="container my-5">
            <h2 className="mb-3">Top Artists</h2>
            <p className="text-muted">Your top artists from the past 4 weeks</p>
            <TopArtistsCarousel artists={topArtists} />
        </div>
    );
};

export default TopArtists;
