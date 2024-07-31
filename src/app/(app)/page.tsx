"use client"
import React from "react";
import { Card, CardContent , CardHeader} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import Navbar from "@/components/custom-components/Navbar";
import messages from "@/messages.json";

const page = () => {
  return (
    <>
    <Navbar/>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-900 text-white">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the world of Anonymous Conversation
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore Echo Envlope - Where your identity remains a secret.
        </p>
      </section>
      
      <Carousel
        plugins={[AutoPlay({delay:2000})]}
       className="embla w-full max-w-xs">
        <CarouselContent>
          {
            messages.map((message, index) => (
              <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                
                  <CardContent className="aspect-square items-center justify-center p-6">
                    <h2 className="mb-16">{message.title}</h2>
                    <span className="text-lg font-semibold">{message.content}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            ))
          }
        </CarouselContent>
        {/* <CarouselPrevious /> */}
        {/* <CarouselNext /> */}
      </Carousel>
          <footer className="text-center p-4 md:p-6 mt-16">
            2024 Echo Envlope. All rights Reserved.
          </footer>
    </main>
    </>
    
  );
};

export default page;
