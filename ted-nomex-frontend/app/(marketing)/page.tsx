import { IMAGES } from "@/lib/assets";
import Link from "next/link";
import { HeroSlider } from "@/components/marketing/HeroSlider";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { ProjectsGrid } from "@/components/marketing/ProjectsGrid";
import { Counters } from "@/components/marketing/Counter";
import "@/styles/home.css";
import { AboutSection } from "@/components/marketing/AboutSection";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";


export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <div className="Text-container Text-Item">
        <div className="container">
          <div className="text">
            <Link href="/">home</Link>
            <span>-</span>
            <p>home slider</p>
          </div>
          <span className="material-symbols-outlined">ungroup</span>
        </div>
      </div>

      {/* Services */}
      <div className="service-container Text-Item">
        <div className="background"></div>
        <img src={IMAGES.servicesBg} alt="img" className="image" />
        <div className="container">
          <br /><br />
          <div className="text-description">
            <div className="description">
              <p>What We Do</p>
              <h3>We Offer Smarter &amp; More Affordable Access To Construction Services and Equipment. We Are Ted-Nomex</h3>
            </div>
            <div className="description">
              <p>At Ted-Nomex, we provide comprehensive construction services and top-notch equipment rentals to streamline your projects. Our goal is to make construction accessible and hassle-free for everyone.</p>
            </div>
          </div>
          <br /><br />
          <ServicesGrid />
        </div>
        <br /><br /><br /><br />
      </div>


      {/* About */}
      <AboutSection />

      {/* Projects (Dark Slider) */}
      <div className="projects-container Text-Item">
        <div className="container">
          <div className="projects-header-row">
            <div className="projects-header-text">
              <h2>Our latest projects</h2>
              <p>At Ted-Nomex Construction Company, we are proud to showcase some of our most recent projects that highlight our expertise, innovation, and commitment to excellence. Here are a few of our latest achievements:</p>
              <Link href="/projects" className="btn-view-all">View all projects</Link>
            </div>
          </div>
        </div>
        
        <div className="projects-slider-container">
          <ProjectsGrid />
        </div>
      </div>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Achievement */}
      <div className="achievement-container Text-Item">
        <div className="achievement">
          <div className="b-rgb">
            <div className="container">
              <div className="text-item">
                <div className="item">
                  <p>some facts about us</p>
                  <h2>leading way in building and civil construction!</h2>
                </div>
                <div className="item">
                  <p>We actively participate in local projects and support initiatives that contribute to the development and well-being of the communities we serve.</p>
                  <div className="line-container">
                    <div className="line1"></div>
                    <div className="line2"></div>
                  </div>
                </div>
              </div>
              <div className="Collection">
                <div className="text-collection">
                  <div className="text-container">
                    <p>more about us</p>
                    <h2>12 Years of Quality and Successful Projects</h2>
                    <p>For over 12 years, Ted-Nomex Construction Company has been at the forefront of the construction industry, delivering projects that exemplify quality, innovation, and success.</p>
                    <div className="btn-container">
                      <Link href="/contact" className="Btn">
                        <span className="material-symbols-outlined">chevron_right</span>
                        <p>request a quote</p>
                      </Link>
                    </div>
                  </div>
                  <div className="background"></div>
                  <div className="Image-container">
                    <img src={IMAGES.aboutHero} alt="" />
                    <div className="image">
                      <div className="play-container">
                        <div className="play">
                          <p><span className="material-symbols-outlined">play_arrow</span></p>
                        </div>
                        <p>video about our company</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Counters
                data={[
                  { label: "finished projects", target: 461 },
                  { label: "happy customers", target: 568 },
                  { label: "years on the market", target: 222 },
                  { label: "skilled professionals", target: 55 },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <br /><br /><br /><br />
    </>
  );
}