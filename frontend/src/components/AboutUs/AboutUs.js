import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import img1 from "./M.r amin.jpg";
import img2 from "./mohammad.png";
import img3 from "./hamidreza.jpg";
import img4 from "./Alireza.jpg";
import img5 from "./ehsan.jpg";
const leadershipTeam = [
  {
    id: 1,
    name: 'محمد جلیلی نیا',
    title: 'گروه فرانت اند',
    description: 'کلاج بگیرید بچه ها زودتر',
    image: img2, // عکس نمایشی
  },
  {
    id: 2,
    name: 'محمد احسان کریمی',
    title: 'گروه بکند',
    description: 'خنک آن قماربازی که هیچش نماند الا هوس قمار دیگر',
    image: img5, // عکس نمایشی
  },
  {
    id: 3,
    name: 'حمیدرضا کردی',
    title: 'گروه بکند',
    description: ' متولد ۸۰ پسری اهل جنوب و بیزار از سرما و کولر در عین حال عاشق بستنی و کوهنوردی',
    image: img3, // عکس نمایشی
  },
  {
    id: 3,
    name: 'علیرضا باقرزاده',
    title: 'گروه فرانت اند',
    description: 'دریغ از یک ارامش خداااااااااااااا',
    image: img4, // عکس نمایشی
  },
];

const AboutUs = () => {
  return (
    <Container className="my-5 text-center">
      <h2 className="mb-5">اعضای گروه  <span className="text-primary">هنگام پایلت</span></h2>
      <div className='d-flex justify-content-center'>
      <Col md={5}>
            <Card className="d-flex justify-content-center  border-1 shadow-sm mb-4">
            <Card.Img variant="top" src={img1} />
            <Card.Body>
            <Card.Title className="fw-bold">Amin Mirlohi</Card.Title>
            <Card.Subtitle className="text-muted mb-2">مدیر تیم</Card.Subtitle>
            <Card.Text> پسر من همیشه به تیمم اطمینان دارم</Card.Text>
            </Card.Body>
          </Card>
          </Col>
          </div>
      <Row>
      
        {leadershipTeam.map((leader) => (
          
          <Col md={3} key={leader.id}>
            <Card className="border-1 shadow-sm mb-4">
              <Card.Img variant="top" src={leader.image} alt={leader.name} />
              <Card.Body>
                <Card.Title className="fw-bold">{leader.name}</Card.Title>
                <Card.Subtitle className="text-muted mb-2">{leader.title}</Card.Subtitle>
                <Card.Text>{leader.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    <div className="row d-flex justify-content-center">
        <div className='col-lg-2'>
            <div className="shadow p-3 mb-5 bg-body rounded d-flex flex-column align-items-center">
            <i class="fas fa-envelope mb-2"style={{fontSize:"75px",padding:"20px",borderStyle:"dotted",borderRadius:"30%",borderColor:"green"}}></i>
                <h2>ایمیل</h2>
                <p>HengamPilot@iust.ac.ir</p>
                </div>
            
            </div>
            <div className='col-lg-2'>
            <div className="shadow p-3 mb-5 bg-body rounded d-flex flex-column align-items-center">
            <i class="bi bi-telephone-fill "style={{fontSize:"52px",padding:"20px",borderStyle:"dotted",borderRadius:"30%",borderColor:"green"}}></i>
                <h2>تلفن</h2>
                <p>021-11111</p>
                </div>
            
            </div>
            
            <div className='col-lg-7'>
            <div className="shadow p-3 mb-5 bg-body rounded d-flex flex-column align-items-center">
            <i class="fas fa-map mb-2"style={{fontSize:"75px",padding:"20px",borderStyle:"dotted",borderRadius:"30%",borderColor:"green"}}></i>
            <h2>آدرس</h2>
            <p>تهران، نارمک، میدان رسالت، خیابان هنگام، خیابان دانشگاه علم و صنعت، دانشگاه علم و صنعت ایران</p>
            </div>
            </div>
        

    </div>
    <div className="row d-flex justify-content-center">
    
       <h2 className='mb-4'>نقشه شرکت در گوگل مپس</h2> 
<iframe
    
  title="نقشه شرکت"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.3673219171565!2d51.5068074!3d35.74177540000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e032fd49e3809%3A0x470e49fef97ae303!2sIran%20University%20of%20Science%20and%20Technology%20(IUST)!5e0!3m2!1sen!2s!4v1734353298701!5m2!1sen!2s"
  width="600"
  height="450"
  style={{ border: 0 }} // به صورت شیء
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>

        
        </div>
    </Container>
  );
};

export default AboutUs;
