import image from '/Images/office.jpg'

import image5 from '/Images/employe.webp'
import ImageCarousel from './Component/ImageCarousel'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import Stepper from './Component/Stepper'

const About = () => {
    const images = [
        { src: image5, alt: 'Employee 1', },
        { src: image5, alt: 'Employee 2' },
        { src: image5, alt: 'Employee 3' },
        { src: image5, alt: 'Employee 4' },
        { src: image5, alt: 'Employee 5' },
    ]

    useEffect(() => {
        AOS.init({ once: true })
    }, [])

    return (
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto overflow-x-hidden">

            {/* Hero Bento Box */}
            <div
                className="glass-card overflow-hidden relative shadow-sm border border-slate-100/50 rounded-3xl group h-[400px]"
                data-aos="fade-up"
                data-aos-duration="1000"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#2457a3]/90 to-[#2457a3]/40 z-10 mix-blend-multiply"></div>
                <img
                    src={image}
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
                        About CRM
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl max-w-2xl font-medium drop-shadow-md">
                        A next-generation human resources management platform built to streamline internal operations for modern teams.
                    </p>
                </div>
            </div>

            {/* Bento Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Who We Are - Spans 2 columns on large screens */}
                <div
                    className="glass-card p-8 shadow-sm border border-slate-100/50 bg-white/70 lg:col-span-2 flex flex-col justify-center"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <div className="bg-[#2457a3]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        <span className="text-[#2457a3] text-2xl">👥</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#2457a3] mb-4">Who We Are</h2>
                    <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                        <p>
                            CRM is a comprehensive HR management platform. We specialize in managing employees, vacations,
                            payroll, projects, assets, and recruitment — all in one centralized hub. Built on cutting-edge technologies
                            like React, Node.js, and MongoDB, we deliver a fast, secure, and intuitive experience.
                        </p>
                        <p>
                            Since our founding, we've partnered with clients across finance, healthcare,
                            education, and e-commerce to deliver solutions that are not only innovative but also infinitely scalable.
                            Our mission is to empower businesses by streamlining operations and driving growth.
                        </p>
                    </div>
                </div>

                {/* Our Mission */}
                <div
                    className="glass-card p-8 shadow-sm border border-slate-100/50 bg-blue-50/40 flex flex-col justify-between"
                    data-aos="fade-up"
                    data-aos-duration="1200"
                >
                    <div>
                        <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                            <span className="text-emerald-600 text-2xl">🚀</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed font-medium mb-6">
                            To deliver innovative and efficient web solutions that drive business growth and user satisfaction.
                            We aim to be more than just a software provider — we are a trusted partner in your digital transformation.
                        </p>
                    </div>
                    <div className="p-4 bg-white/60 rounded-xl border border-white/80 shadow-inner">
                        <p className="text-sm font-semibold text-[#2457a3] text-center">
                            "Empowering teams worldwide."
                        </p>
                    </div>
                </div>

                {/* What We Do */}
                <div
                    className="glass-card p-8 shadow-sm border border-slate-100/50 bg-white/70 lg:col-span-3"
                    data-aos="fade-up"
                    data-aos-duration="1400"
                >
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                        <div className="flex-1 space-y-4 text-slate-600 leading-relaxed font-medium">
                            <h2 className="text-2xl font-bold text-[#2457a3] mb-2">What We Do</h2>
                            <p>
                                Our complete HR toolkit spans front-end, back-end, and database development,
                                focusing on cost savings, time efficiency, and maximum flexibility.
                            </p>
                            <p>
                                Communication is key to success. We ensure your operations stay on track,
                                deadlines are met, and friction is eliminated. This guarantees that your
                                daily operations are as smooth and transparent as possible.
                            </p>
                            <div className="mt-8">
                                <Stepper />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Carousel Bento Box */}
                <div
                    className="glass-card p-8 shadow-sm border border-slate-100/50 bg-white/70 lg:col-span-3 overflow-hidden"
                    data-aos="fade-up"
                    data-aos-duration="1600"
                >
                    <div className="flex items-center justify-between mb-8 border-b border-slate-100/50 pb-4">
                        <h3 className="text-2xl font-bold text-slate-800">Meet Our Team</h3>
                        <span className="px-3 py-1 bg-blue-50 text-[#2457a3] text-xs font-bold uppercase tracking-wider rounded-full">Excellence</span>
                    </div>
                    <div className="w-full">
                        <ImageCarousel images={images} />
                    </div>
                </div>

            </div>

            <div
                className="mt-12 text-center pb-8"
                data-aos="fade-in"
                data-aos-duration="1000"
            >
                <span className="inline-block px-6 py-2 bg-white/50 backdrop-blur-md border border-slate-200/50 rounded-full text-sm font-bold text-slate-500 shadow-sm tracking-widest uppercase">
                    CRM — The Modern HR Management Platform
                </span>
            </div>
        </div>
    )
}

export default About
