"use client";
import { useState, useCallback, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DotButton, useDotButton } from '../common/EmblaCarouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '../common/EmblaCarouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { pdfjs, Document, Page } from 'react-pdf';
import { ThreeDots } from 'react-loader-spinner';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function LeadLagPlots() {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#ffffff',
            },
        },
        breakpoints: {
            values: {
                "2xl": 1536,
                "3xl": 1920,
            },
        },
    });

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 1500, stopOnMouseEnter: false, stopOnInteraction: true })]);

    const onNavButtonClick = useCallback((emblaApi) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? autoplay.reset
                : autoplay.stop

        resetOrStop()
    }, []);

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
        emblaApi,
        onNavButtonClick
    );

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi, onNavButtonClick);

    const [antibiotic, setAntibiotic] = useState('Imipenem');

    const handleTabChange = (event, newValue) => {
        setAntibiotic(newValue);
    };

    const antibioticDocuments = {
        Imipenem: [
            { fileUrl: '/lead-lags/Klebsiella pneumoniae_Urine.pdf', pages: [6, 10] },
        ],
        Meropenem: [
            { fileUrl: '/lead-lags/Escherichia coli_Blood.pdf', pages: [3, 6, 8, 10] },
            { fileUrl: '/lead-lags/Klebsiella pneumoniae_Blood.pdf', pages: [4, 5, 6] },
            { fileUrl: '/lead-lags/Klebsiella pneumoniae_Urine.pdf', pages: [7] }
        ],
    };

    const getScale = (width) => {
        if (width <= 400) return 0.5;
        if (width <= 500) return 0.6;
        if (width <= 600) return 0.65;
        if (width <= 725) return 0.73;
        if (width <= 800) return 0.77;
        if (width <= 880) return 0.8;
        if (width <= 1024) return 1.2;
        if (width <= 1280) return 1.4;
        if (width <= 1536) return 1.6;
        if (width <= 1920) return 1.8;
        return 2.4;
    };

    const [scale, setScale] = useState(() => {
        if (typeof window !== 'undefined') {
            return getScale(window.innerWidth);
        }
        return 1; // Default scale if window is not defined
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateScale = () => {
                setScale(getScale(window.innerWidth));
            };

            window.addEventListener('resize', updateScale);
            return () => {
                window.removeEventListener('resize', updateScale);
            };
        }
    }, []);

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Tabs
                    className="mb-4"
                    value={antibiotic}
                    onChange={handleTabChange}
                    centered
                    indicatorColor="primary"
                >
                    <Tab
                        label="Imipenem"
                        value="Imipenem"
                        sx={{
                            fontSize: {
                                sm: '1.1rem',
                                md: '1.2rem',
                                lg: '1.4rem',
                                "2xl": "1.6rem",
                                "3xl": "2rem",
                            },
                            color: 'white',
                            textTransform: 'none',
                            marginRight: {
                                sm: '15px',
                                md: '20px',
                                xl: '25px',
                                "2xl": "30px",
                                "3xl": "40px",
                            },
                            '&.Mui-selected': {
                                color: 'white',
                            },
                        }}
                    />
                    <Tab
                        label="Meropenem"
                        value="Meropenem"
                        sx={{
                            fontSize: {
                                sm: '1.1rem',
                                md: '1.2rem',
                                lg: '1.4rem',
                                "2xl": "1.6rem",
                                "3xl": "2rem",
                            },
                            color: 'white',
                            textTransform: 'none',
                            marginLeft: {
                                sm: '15px',
                                md: '20px',
                                xl: '25px',
                                "2xl": "30px",
                                "3xl": "40px",
                            },
                            '&.Mui-selected': {
                                color: 'white',
                            },
                        }}
                    />
                </Tabs>
            </ThemeProvider>
            <section style={{ width: "80%" }} className="embla flex flex-col">
                <div className="embla__viewport 2xl:my-3" ref={emblaRef}>
                    <div className="embla__container">
                        {antibioticDocuments[antibiotic].map((doc, docIndex) => (
                            doc.pages.map((pageNumber) => (
                                <div className="embla__slide flex justify-center items-center" key={`page_${docIndex}_${pageNumber}`}>
                                    <div className="rounded-xl shadow-lg overflow-hidden">
                                        <Document
                                            file={doc.fileUrl}
                                            loading={
                                                <div className="flex justify-center items-center">
                                                    <ThreeDots
                                                        visible={true}
                                                        height="80"
                                                        width="80"
                                                        color="#4F6077"
                                                        radius="9"
                                                        ariaLabel="three-dots-loading"
                                                        wrapperStyle={{}}
                                                        wrapperClass=""
                                                    />
                                                </div>
                                            }
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                                scale={scale}
                                            />
                                        </Document>
                                    </div>
                                </div>
                            ))
                        ))}
                    </div>
                </div>
                <div className="flex flex-row justify-around mt-3">
                    <div className="embla__buttons">
                        <PrevButton
                            onClick={onPrevButtonClick}
                            disabled={prevBtnDisabled}
                        />
                        <NextButton
                            onClick={onNextButtonClick}
                            disabled={nextBtnDisabled}
                        />
                    </div>
                    <div className="embla__dots">
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                                key={index}
                                onClick={() => onDotButtonClick(index)}
                                className={'embla__dot'.concat(
                                    index === selectedIndex ? ' embla__dot--selected' : '',
                                )}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}