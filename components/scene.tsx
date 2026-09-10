import Image from 'next/image';
export function Scene({src,alt,children,className='',priority=false}:{src:string;alt:string;children:React.ReactNode;className?:string;priority?:boolean}){return <section className={`auto-scene ${className}`}><Image src={src} alt={alt} fill sizes="100vw" priority={priority}/><div className="scene-shade"/><div className="scene-content">{children}</div></section>}
