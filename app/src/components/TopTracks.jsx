import React from "react";
import { Carousel, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TrackCard = ({ track }) => {
    const imageUrl = track.album?.images?.[0]?.url;

    return (
        <Col md={2} className="d-flex flex-column align-items-center">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={track.name || ""}
                    className="img-fluid rounded"
                    style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                />
            ) : (
                <div
                    className="bg-secondary rounded"
                    style={{ width: '100%', paddingTop: '100%' }}
                />
            )}

            <div className="fw-semibold mt-2 text-center">
                {track.place}. {track.name}
            </div>
            <div
                className="text-muted text-center small text-truncate"
                style={{ maxWidth: '100%' }}
            >
                {track.artists?.[0]?.name || 'Unknown artist'}
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

const TopTracksCarousel = ({ tracks }) => {
    // On ajoute une propriété "place" à chaque track
    const chunkedTracks = chunkArray(
        tracks.map((t, i) => ({ ...t, place: i + 1 })),
        5
    );

    return (
        <Carousel>
            {chunkedTracks.map((group, index) => (
                <Carousel.Item key={index}>
                    <Row className="justify-content-center">
                        {group.map((track, i) => (
                            <TrackCard key={i} track={track} />
                        ))}
                    </Row>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

const TopTracks = ({ topTracks }) => {
    return (
        <div className="container my-5">
            <h2 className="mb-3">Top Tracks</h2>
            <p className="text-muted">Your top tracks from the past 4 weeks</p>
            <TopTracksCarousel tracks={topTracks} />
        </div>
    );
};

export default TopTracks;
