import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPage } from "../redux/actions/pageActions";
import { Container, Button } from "reactstrap";
import captionRoom from "../captionRoom.jpg";
import { classHeading } from "../config";
const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPage("Home"));
    }, [dispatch]);
    return (
        <Container className="content">
            <div className={`${classHeading} mb-2`}>
                <h1>Copyright Information</h1>
                <Button
                    className="ml-auto"
                    color="primary"
                    href="mailto:lisa.june@education.wa.edu.au"
                >
                    Click here to contact the Captioning Office
                </Button>
            </div>
            <img src={captionRoom} className="topImage mb-2" alt="Caption Room" />
            <p>
                <strong className="infoLabel">Rationale</strong>
                <br />
                Shenton College Deaf Education Centre can enrol a diverse range of Deaf and Hard of
                Hearing students in the school, who can then access the services and facilities of
                Shenton College. In order for these students to view audio/visual texts, it is
                necessary for all such texts to be captioned.
            </p>
            <p>
                <strong className="infoLabel">Policy Statement</strong>
                <br />
                It is the policy of Shenton College Deaf Education Centre and Shenton College that
                all media that is shown in the classroom is to be captioned. Teachers shall, at all
                times, ensure that only captioned videos or DVDs are shown in classes with Deaf or
                Hard of Hearing students.
            </p>
            <p>
                If you have a video or DVD that you would like captioned, or if you would like to
                source a captioned video or DVD on a given topic, please contact the captioning
                office of the Deaf Education Centre.
            </p>
            <p>
                <strong className="infoLabel">Background</strong>
                <br />
                The Deaf Education Centre provides a service to all teachers to ensure that it is
                possible for teachers to obtain a captioned copy of any video/DVD/media file.
            </p>
            <p>The Deaf Education Centre has a library of DVDs and MP4 format media available.</p>
            <p>
                Many DVDs are commercially available with closed or open captions. Either way, they
                can be shown to the students. The Deaf Education Centre has information on what DVDs
                are available commercially.
            </p>
            <p>
                If the DVD/media is not available through any of these means, the Deaf Education
                Centre can caption a copy of the media. The school must have a purchased copy of the
                DVD before we can make another copy for captioning.
            </p>
            <p>
                <strong className="infoLabel">Access to the Curriculum</strong>
                <br />
                Schools are now mandated to comply with the Disability Discrimination Act 1992 and
                the Disability Standards for Education 2005. The Act and Standards place an
                obligation on schools to ensure that all students who are Deaf or hard of hearing
                are provided with equitable access to the curriculum. Measures for compliance with
                the Standards include the availability of materials in a format that is appropriate
                for the student. (Disability Standards for Education 2005 sections 5.2 (1) and 6.2
                (1)).
            </p>
            <p>
                The Disability Standards for Education 2005 also places an obligation on schools to
                ensure that students are not disadvantaged by the time taken for conversion of
                materials into alternative accessible formats. (Disability Standards for Education
                2005 section 6.3(c)).
            </p>
            <p>
                In addition the Standards provide for staff to be informed of the availability of
                specialised services to enable them to assist students to access these services.
                (Disability Standards for Education 2005 section 7.3(a)).
            </p>
            <p>
                In reference to the Disability Standards for Education 2005 schools may already be
                able to meet these obligations because many commercially produced DVDs come with
                pre-installed captions/subtitles. However there are still a number of items being
                used in schools which do not have this feature.
            </p>
            <p>
                <strong className="infoLabel">Procedures</strong>
            </p>
            <p>
                <i>
                    Deaf Education Library
                    <br />
                </i>
                To make use of captioned media from the Deaf Education Centre, please contact the
                Shenton College Deaf Education Captioning Office.
            </p>
            <p>
                <i>
                    Getting a Television Program Recorded
                    <br />
                </i>
                Free to air television programmes are now viewed through ClickView 24/7. Captioning
                staff can upload any programme with television subtitles, within a fortnight of the
                broadcast.
                <i>
                    <br />
                </i>
            </p>
            <p>
                <i>
                    Obtaining a Commercial Copy
                    <br />
                </i>
                When purchasing a commercial DVD, every endeavour should be made to purchase a
                captioned version of the product.If you have not been able to purchase a captioned
                version, see the captioning office, as they may be able to suggest other venues from
                which to purchase.
            </p>
            <p>
                <i>
                    Getting an Existing DVD Captioned
                    <br />
                </i>
                Captioning is a time-consuming process so schools/teachers need to give at least two
                weeks’ notice of items requiring captioning, particularly if the item is longer than
                30 minutes. Once completed, the original DVD will be returned and an MP4 version
                will be made available to the teacher via a USB or placed into the online ClickView
                Library website.
            </p>
        </Container>
    );
};

export default Home;
