/* eslint-disable @next/next/no-img-element */
import React from "react";
import { SectionContainer } from "@/containers";
import { events } from "@/resources";
import { Event } from "@/resources/data";

import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

export const EventsSection = () => {
    const [currentEventId, setCurrentEventId] = React.useState<number>(0);
    const [currentEvent, setCurrentEvent] = React.useState<Event>(events[currentEventId]);

    const handleCtaClick = () => {
        window.open(currentEvent.url, "_blank");
        console.log("opened", currentEvent.url);
    };

    const handleChangeEventButtonClick = (direction: "left" | "right") => {
        let newId = currentEventId;
        if (direction === "left") {
            newId = currentEventId === 0 ? events.length - 1 : currentEventId - 1;
        } else if (direction === "right") {
            newId = currentEventId === events.length - 1 ? 0 : currentEventId + 1;
        }

        setCurrentEventId(newId);
        setCurrentEvent(events[newId]);
    };


    return (
        <SectionContainer id="events" addionalClassName="flex flex-col items-center justify-center gap-25">
            {/* Title */}
            <div className="flex flex-col px-75 text-right items-end">
                <h2 className="text-5xl font-black text-right text-[#a374ff] text-nowrap self-start uppercase drop-shadow-sm">
                    {"Events"}
                </h2>

                <p className="text-6xl text-left font-extralight text-gray-100 leading-relaxed tracking-wide">
                    {"A collection of events that I'm proud of."}
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 grid-rows-3 gap-5 w-450 h-300">
                {/* Left Card */}
                <div className="row-span-1 col-span-1 flex flex-col rounded-3xl shadow-lg gap-10 p-10 backdrop-brightness-50"
                    style={{ backgroundImage: `url('${currentEvent.images[0]}')` }}
                >
                    <div className="flex flex-row w-full h-min items-center justify-start p-3 gap-3">
                        <button onClick={() => handleChangeEventButtonClick("left")} className="size-15 bg-[#a374ff] rounded-full group">
                            <IoMdArrowDropleft color="#2a2550" size="full" className="group-hover:animate-pulse group-hover:cursor-pointer duration-300" />
                        </button>
                        <button onClick={() => handleChangeEventButtonClick("right")} className="size-15 bg-[#ffd074] rounded-full group">
                            <IoMdArrowDropright color="#2a2550" size="full" className="group-hover:animate-pulse group-hover:cursor-pointer duration-300" />
                        </button>
                    </div>

                    <div className="text-left flex flex-col gap-2">
                        <div className="text-white font-semibold text-4xl">
                            {currentEvent.name}
                        </div>
                        <div className="text-md mb-5 leading-tight text-gray-300">
                            {currentEvent.meta}
                        </div>
                    </div>

                    <button id="contact-cta" onClick={handleCtaClick} className="self-start justify-self-end px-4 py-2 rounded-full group 
                            transition-all duration-500 bg-[#ffd074] text-black font-bold text-4xl hover:bg-[#a374ff] hover:cursor-pointer"
                    >
                        <p className="group-hover:animate-pulse text-[0.75em] font-light">
                            See Event Details
                        </p>
                    </button>
                </div>

                {/* Big image on top right */}
                <div className="col-span-2 row-span-2 bg-black rounded-3xl overflow-hidden shadow-lg">
                    <img src={currentEvent.images[1]} alt="BIG BOY" className="w-full h-full object-cover brightness-75" />
                </div>

                {/* Long image under info card */}
                <div className="col-span-1 row-span-2 bg-black rounded-3xl overflow-hidden shadow-lg">
                    <img src={currentEvent.images[2]} alt="LONG BOY" className="w-full h-full object-cover brightness-75" />
                </div>

                {/* Small 1x1 image on bottom center. */}
                <div className="col-span-1 row-span-1 bg-black rounded-3xl overflow-hidden shadow-lg">
                    <img src={currentEvent.images[3]} alt="BOTTOM CENTER" className="w-full h-full object-cover brightness-75" />
                </div>

                {/* Small 1x1 image on bottom right. */}
                <div className="col-span-1 row-span-1 bg-black rounded-3xl overflow-hidden shadow-lg">
                    <img src={currentEvent.images[4]} alt="BOTTOM CENTER" className="w-full h-full object-cover brightness-75" />
                </div>

            </div>
        </SectionContainer >
    );
};

export default EventsSection;
