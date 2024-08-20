import { Fragment } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const GKStepper = ({ currentStep, steps }) => {
  return (

      <Container>
        <div className="stepper">
          <Row>
            <Col lg={{ span: 10, offset: 1 }} md={12} sm={12} className='mx-auto '>
              <div className="stepper ">
                <div className="stepper-header shadow-sm rounded">
                  {steps.map((step) => (
                    <Fragment key={step.id}>
                      <div className={`step ${step.id === currentStep ? 'active' : ''}`}>
                        <Button bsPrefix="step-trigger">
                          <span className="stepper-circle">{step.id}</span>
                          <span className="stepper-label">{step.title}</span>
                        </Button>
                      </div>
                      {steps.length > step.id ? <div className="stepper-line"></div> : ''}
                    </Fragment>
                  ))}
                </div>
                <div className="stepper-content mt-4 p-4 bg-white rounded border shadow-sm">
                  <div className="stepper-pane fade active">{steps[currentStep - 1].content}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
  );
};

export default GKStepper;
