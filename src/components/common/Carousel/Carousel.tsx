import React from 'react';
// import styles from './Carousel.module.scss'; // SCSS Removed

// Import images with correct relative path
// Images moved to public/assets/prathilipi to avoid Base64 inlining

interface Author {
  name: string;
  image: string;
  link: string;
}

const Carousel: React.FC = () => {
  const authors: Author[] = [
    {
      name: 'Swetha swe',
      image: '/assets/prathilipi/swetha swe.jpg',
      link: 'https://tamil.pratilipi.com/user/%F0%9F%92%99swetha%F0%9F%92%99-8cuvz20w13'
    },
    {
      name: 'Thenmozhi',
      image: '/assets/prathilipi/thenmozhi.jpg',
      link: 'https://tamil.pratilipi.com/user/%E2%9C%8D%EF%B8%8F%E0%AE%A4%E0%AF%87%E0%AE%A9%E0%AF%8D%E0%AE%AE%E0%AF%8A%E0%AE%B4%E0%AE%BF-%E2%9C%8D%EF%B8%8F-34-thenmozhi-34-u0958h9i3f?utm_campaign=authorprofile_share&utm_source=ios'
    },
    {
      name: 'Mohanaamozhi',
      image: '/assets/prathilipi/mohanamozhi.jpg',
      link: 'https://tamil.pratilipi.com/user/%E2%9C%8D%EF%B8%8F-%E0%AE%AE%E0%AF%8B%E0%AE%95%E0%AE%A9%E0%AE%BE-%E2%9C%8D%EF%B8%8F-697n99g2nt'
    }
  ];

  return (
    <div className="w-full relative overflow-hidden transition-all duration-500 galaxy-bg">
      <div className="star-layer stars-2"></div>
      <div className="star-layer stars-3"></div>
      <div className="w-full h-[250px] md:h-[280px] lg:h-[300px] flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-center gap-6 md:gap-8 p-4 md:p-6 w-full z-10">
          
          {/* Title - Always White */}
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 tracking-wide text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Follow us on Pratilipi for more stories!
          </h2>

          {/* Authors Grid */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-16">
            {authors.map((author, index) => (
              <a
                key={index}
                href={author.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                {/* Image Wrapper */}
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-pink-500 relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-transparent bg-white">
                    <img
                      src={author.image}
                      alt={author.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md group-hover:bg-purple-500/40 transition-colors duration-300 -z-10"></div>
                </div>

                {/* Author Name - Always White */}
                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                  {author.name}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
