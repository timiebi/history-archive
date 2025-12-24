
export default function StoryDetailPage() {
  const story = {
    title: "The Rise of the Mali Empire",
    category: "Kingdoms",
    publishedAt: "1324 AD",
    author: "Historical Archive",
    content: `The Mali Empire was one of the greatest civilizations in African history. It rose to prominence in the 13th century under the leadership of Sundiata Keita, the Lion Prince...`,
    cover: "/stories/zimbabwe2.jpg",
  };

  return (
    <article className="bg-[#fcfaf7] dark:bg-stone-950 min-h-screen pb-20">
      {/* Cinematic Hero */}
      <header className="relative h-[60vh] md:h-[80vh] w-full">
        <img src={story.cover} alt={story.title} className="object-cover h-full w-full" />
        <div className="absolute inset-0 bg-linear-to-t from-[#fcfaf7] dark:from-stone-950 via-stone-950/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="max-w-4xl mx-auto">
            <span className="bg-orange-700 text-white px-4 py-1 text-[10px] font-black tracking-[0.3em] uppercase mb-6 inline-block">
              {story.category}
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-stone-900 dark:text-white">
              {story.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Meta Info Bar */}
      <div className="max-w-4xl mx-auto px-6 py-8 border-b border-stone-200 dark:border-stone-800 flex flex-wrap gap-8 items-center text-xs font-bold uppercase tracking-widest text-stone-500">
        <div>Era: <span className="text-stone-900 dark:text-stone-100">{story.publishedAt}</span></div>
        <div className="h-1 w-1 rounded-full bg-orange-600" />
        <div>Source: <span className="text-stone-900 dark:text-stone-100">{story.author}</span></div>
      </div>

      {/* Manuscript Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="prose prose-stone lg:prose-2xl dark:prose-invert prose-dropcap:text-orange-700">
          <p className="font-serif leading-relaxed first-letter:text-8xl first-letter:font-black first-letter:text-orange-700 first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
            {story.content}
          </p>
          
          {/* Historical Pull Quote */}
          <blockquote className="my-16 border-l-0 border-y border-stone-200 dark:border-stone-800 py-12">
             <p className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-tight text-center text-orange-800 dark:text-orange-500">
                "Where the King walks, the gold follows, and the world remembers."
             </p>
          </blockquote>

          <p className="font-serif leading-relaxed">
            The wealth of the empire was not merely in gold, but in the libraries of Timbuktu. 
            Mali became a beacon of Islamic science, mathematics, and astronomy...
          </p>
        </div>

        {/* Culture Tagging */}
        <div className="mt-20 pt-10 border-t border-stone-200 dark:border-stone-800">
          <p className="text-xs font-black tracking-widest uppercase mb-4">Related Cultures</p>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-stone-100 dark:bg-stone-900 border text-xs font-bold uppercase cursor-pointer hover:bg-orange-700 hover:text-white transition-colors">Mandinka</span>
            <span className="px-4 py-2 bg-stone-100 dark:bg-stone-900 border text-xs font-bold uppercase cursor-pointer hover:bg-orange-700 hover:text-white transition-colors">Tuareg</span>
          </div>
        </div>
      </div>
    </article>
  );
}