/* eslint-disable @next/next/no-img-element */
import React from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { motion, AnimatePresence } from "motion/react";

import { events } from "@/data";
import { Header } from "@/components";
import { SectionContainer } from "@/containers";
import { events as eventsContent } from "@/content";

const fadeInOut = {
    initial: { opacity: 0, y: 30, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -30, scale: 0.97, transition: { duration: 0.35 } },
};

const imgFade = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } },
};

export const EventsSection = () => {
    const [currentEventId, setCurrentEventId] = React.useState<number>(0);
    const currentEvent = events[currentEventId];
    const eventKey = `${currentEventId}`;

    const handleCtaClick = () => {
        window.open(currentEvent.url, "_blank");
        console.log("opened", currentEvent.url);
    };

    const handleChangeEventButtonClick = (dir: "left" | "right") => {
        setCurrentEventId((prevId) => {
            if (dir === "left") {
                return prevId === 0 ? events.length - 1 : prevId - 1;
            } else {
                return prevId === events.length - 1 ? 0 : prevId + 1;
            }
        });
    };

    return (
        <SectionContainer id="events" addionalClassName="flex flex-col items-center justify-center gap-25 min-h-screen">
            {/* Title */}
            <Header title={eventsContent.title} subtitle={eventsContent.description} />

            {/* Animated Event Content */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div key={eventKey} className="grid grid-cols-3 grid-rows-3 gap-5 w-450 h-300"
                    variants={fadeInOut} initial="initial" animate="animate" exit="exit"
                >
                    {/* Left Card */}
                    <motion.div className="row-span-1 col-span-1 flex flex-col rounded-3xl shadow-lg gap-10 p-10 backdrop-brightness-50"
                        variants={fadeInOut} initial="initial" animate="animate" exit="exit"
                        style={{ backgroundImage: `url('${currentEvent.images[0]}')` }}
                    >
                        <div className="flex flex-row w-full h-min items-center justify-start p-3 gap-3">
                            <button
                                onClick={() => handleChangeEventButtonClick("left")}
                                className="size-15 bg-[#a374ff] rounded-full group"
                            >
                                <IoMdArrowDropleft color="#2a2550" size="full" className="group-hover:animate-pulse group-hover:cursor-pointer duration-300" />
                            </button>
                            <button
                                onClick={() => handleChangeEventButtonClick("right")}
                                className="size-15 bg-[#ffd074] rounded-full group"
                            >
                                <IoMdArrowDropright color="#2a2550" size="full" className="group-hover:animate-pulse group-hover:cursor-pointer duration-300" />
                            </button>
                        </div>

                        <motion.div className="text-left flex flex-col gap-2"
                            variants={fadeInOut} initial="initial" animate="animate" exit="exit"
                        >
                            <div className="text-white font-semibold text-4xl">
                                {currentEvent.name}
                            </div>
                            <div className="text-md mb-5 leading-tight text-gray-300">
                                {currentEvent.meta}
                            </div>
                        </motion.div>

                        <button id="contact-cta" onClick={handleCtaClick} className="self-start justify-self-end px-4 py-2 rounded-full group 
                               transition-all duration-500 bg-[#ffd074] text-black font-bold text-4xl hover:bg-[#a374ff] hover:cursor-pointer"
                        >
                            <p className="group-hover:animate-pulse text-[0.75em] font-light">
                                {eventsContent.cta}
                            </p>
                        </button>
                    </motion.div>

                    {/* Big image on top right */}
                    <motion.div className="col-span-2 row-span-2 bg-black rounded-3xl overflow-hidden shadow-lg flex flex-col justify-end relative"
                        variants={imgFade} initial="initial" animate="animate" exit="exit"
                    >
                        <motion.p key={currentEvent.description} className="z-4 px-20 py-10 text-2xl text-center font-light"
                            variants={fadeInOut} initial="initial" animate="animate" exit="exit"
                        >
                            {currentEvent.description}
                        </motion.p>
                        <motion.img src={currentEvent.images[1]} alt="BIG BOY" className="absolute inset-0 w-full h-full object-cover brightness-50"
                            key={currentEvent.images[1]} variants={imgFade} initial="initial" animate="animate" exit="exit"
                        />
                    </motion.div>

                    {/* Long image under info card */}
                    <motion.div className="col-span-1 row-span-2 bg-black rounded-3xl overflow-hidden shadow-lg"
                        variants={imgFade} initial="initial" animate="animate" exit="exit"
                    >
                        <motion.img src={currentEvent.images[2]} alt="LONG BOY" className="w-full h-full object-cover brightness-75"
                            key={currentEvent.images[2]} variants={imgFade} initial="initial" animate="animate" exit="exit"
                        />
                    </motion.div>

                    {/* Small 1x1 image on bottom center. */}
                    <motion.div className="col-span-1 row-span-1 bg-black rounded-3xl overflow-hidden shadow-lg"
                        variants={imgFade} initial="initial" animate="animate" exit="exit"
                    >
                        <motion.img src={currentEvent.images[3]} alt="BOTTOM CENTER" className="w-full h-full object-cover brightness-75"
                            key={currentEvent.images[3]} variants={imgFade} initial="initial" animate="animate" exit="exit"
                        />
                    </motion.div>

                    {/* Small 1x1 image on bottom right. */}
                    <motion.div className="col-span-1 row-span-1 bg-black rounded-3xl overflow-hidden shadow-lg"
                        variants={imgFade} initial="initial" animate="animate" exit="exit"
                    >
                        <motion.img src={currentEvent.images[4]} alt="BOTTOM CENTER" className="w-full h-full object-cover brightness-75"
                            key={currentEvent.images[4]} variants={imgFade} initial="initial" animate="animate" exit="exit"
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </SectionContainer>
    );
};

export default EventsSection;
