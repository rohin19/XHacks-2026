import svgPaths from "./svg-hhn6wfoduj";
import imgImageSkyBackground from "figma:asset/e7f54fcaced8a688fe086b10ebead4b2e6ee9683.png";

function ImageSkyBackground() {
  return (
    <div className="absolute h-[1304px] left-0 top-0 w-[2189px]" data-name="Image (Sky background)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageSkyBackground} />
    </div>
  );
}

function Container1() {
  return <div className="absolute bg-gradient-to-b from-[rgba(28,57,142,0.2)] h-[1304px] left-0 to-[rgba(28,57,142,0.3)] top-0 via-1/2 via-[rgba(0,0,0,0)] w-[2189px]" data-name="Container" />;
}

function Container() {
  return (
    <div className="absolute h-[1304px] left-0 top-0 w-[2189px]" data-name="Container">
      <ImageSkyBackground />
      <Container1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[40px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[2%]" data-name="Vector">
        <div className="absolute inset-[-1.04%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39.2 39.2">
            <path d={svgPaths.p3e972280} id="Vector" stroke="var(--stroke-0, white)" strokeOpacity="0.9" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[12%_27.5%_43%_27.5%] leading-[normal] not-italic text-[15.2px] text-[rgba(255,255,255,0.9)] text-center">nn</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[134.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.8)] top-0 tracking-[0.55px] uppercase">neighborhood news</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[68.5px] items-center left-[48px] top-[48px] w-[2093px]" data-name="Header">
      <Container3 />
      <Text />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute font-['Inter:Light',sans-serif] font-light h-[274px] leading-[112px] left-[665.44px] not-italic text-[112px] text-center text-white top-0 tracking-[-4.48px] w-[810.125px]" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute left-[405px] top-0">Your community,</p>
      <p className="-translate-x-1/2 absolute left-[405.13px] top-[112px]">your news.</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px relative" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[32px] py-[20px] relative size-full">
          <p className="font-['Inter:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.5)] tracking-[-0.16px]">enter your address</p>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[69.42%_12.5%_12.5%_69.42%]" data-name="Vector">
        <div className="absolute inset-[-17.28%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.86667 4.86667">
            <path d="M4.24167 4.24167L0.625 0.625" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_20.83%_20.83%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-4.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5833 14.5833">
            <path d={svgPaths.p95dc940} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(150,150,150,0.7)] relative rounded-[33554400px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.2)] shrink-0 size-[52px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] px-[16px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.12)] content-stretch flex gap-[8px] h-[70px] items-center left-[734.5px] pl-px pr-[9px] py-px rounded-[100px] top-[290px] w-[672px]" data-name="Form">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[100px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)]" />
      <TextInput />
      <Button />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[25.188px] left-[823.88px] top-[384px] w-[493.234px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Light',sans-serif] font-light leading-[25.2px] left-[247px] not-italic text-[18px] text-[rgba(255,255,255,0.7)] text-center top-px tracking-[0.36px]">The most recent local news that affects your community.</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[19.5px] left-0 top-0 w-[136.531px]" data-name="Text">
      <p className="absolute font-['Courier_New:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] top-0 tracking-[1.3px] uppercase">01 — hyperlocal</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[19.5px] left-[184.53px] top-0 w-[127.422px]" data-name="Text">
      <p className="absolute font-['Courier_New:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] top-0 tracking-[1.3px] uppercase">02 — real-time</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[19.5px] left-[359.95px] top-0 w-[118.328px]" data-name="Text">
      <p className="absolute font-['Courier_New:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[13px] text-[rgba(255,255,255,0.6)] top-0 tracking-[1.3px] uppercase">03 — relevant</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[19.5px] left-[831.36px] top-[449.19px] w-[478.281px]" data-name="Container">
      <Text1 />
      <Text2 />
      <Text3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[468.688px] relative shrink-0 w-[2141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading />
        <Form />
        <Paragraph />
        <Container6 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[651.109px] items-center justify-center left-0 pb-[128.016px] top-[164.5px] w-[2189px]" data-name="Container">
      <Container5 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[15px] relative shrink-0 w-[189.031px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Courier_New:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.4)] top-0 tracking-[1px] uppercase">globe component placeholder</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.08)] content-stretch flex h-[456.391px] items-center justify-center left-[32px] p-px rounded-[16px] top-[815.61px] w-[2125px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.1)]" />
      <Paragraph1 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.1)]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[1304px] left-0 top-0 w-[2189px]" data-name="Container">
      <Header />
      <Container4 />
      <Container7 />
    </div>
  );
}

export default function DesignAntigravityLandingPage() {
  return (
    <div className="bg-white relative size-full" data-name="Design Antigravity Landing Page">
      <Container />
      <Container2 />
    </div>
  );
}