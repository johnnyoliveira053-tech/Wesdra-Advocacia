
import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Gavel, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Clock, 
  MessageSquare, 
  ChevronRight,
  Star,
  Quote,
  Menu,
  X,
  Send,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { getChatResponse } from './services/geminiService';
import { PracticeArea, Testimonial, ChatMessage } from './types';

// Components defined outside for better performance
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Áreas de Atuação', href: '#practice' },
    { name: 'Depoimentos', href: '#testimonials' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Scale className={`h-8 w-8 ${isScrolled ? 'text-blue-900' : 'text-white'}`} />
          <div className="flex flex-col">
            <span className={`font-serif text-xl font-bold leading-none ${isScrolled ? 'text-blue-900' : 'text-white'}`}>
              ALAN WESDRA
            </span>
            <span className={`text-[10px] tracking-widest font-medium ${isScrolled ? 'text-blue-700' : 'text-blue-200'}`}>
              ADVOCACIA & CONSULTORIA
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${isScrolled ? 'text-slate-700' : 'text-white'}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className={isScrolled ? 'text-slate-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full border-t border-slate-100 shadow-xl py-4 flex flex-col items-center space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-800 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou o assistente virtual do Dr. Alan Wesdra. Como posso ajudar com suas dúvidas jurídicas hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getChatResponse(userMsg, history);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] md:w-[400px] h-[500px] flex flex-col border border-slate-200 overflow-hidden">
          <div className="bg-blue-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                <Scale size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Assistente Jurídico AI</h3>
                <p className="text-[10px] text-blue-200">Alan Wesdra Advocacia</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center">
                  <Loader2 className="animate-spin text-blue-900 mr-2" size={16} />
                  <span className="text-xs text-slate-500">Analisando...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white flex items-center space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-900 text-white p-2 rounded-full hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-900 text-white p-4 rounded-full shadow-lg hover:bg-blue-800 hover:scale-110 transition-all flex items-center space-x-2"
        >
          <MessageSquare size={24} />
          <span className="hidden md:inline font-medium">Dúvida Jurídica?</span>
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const practiceAreas: PracticeArea[] = [
    { title: 'Direito Civil', description: 'Atuação em contratos, responsabilidade civil, danos morais e materiais.', icon: <Users className="w-10 h-10" /> },
    { title: 'Direito Criminal', description: 'Defesa técnica especializada em todas as fases do processo penal.', icon: <ShieldCheck className="w-10 h-10" /> },
    { title: 'Direito Trabalhista', description: 'Proteção de direitos do trabalhador e consultoria empresarial preventiva.', icon: <Briefcase className="w-10 h-10" /> },
    { title: 'Família e Sucessões', description: 'Divórcios, pensão alimentícia, guarda e inventários.', icon: <Scale className="w-10 h-10" /> },
    { title: 'Direito Previdenciário', description: 'Auxílio na obtenção de aposentadorias, pensões e benefícios do INSS.', icon: <Gavel className="w-10 h-10" /> },
    { title: 'Consultoria Jurídica', description: 'Orientação estratégica para prevenção de litígios e conformidade legal.', icon: <MessageSquare className="w-10 h-10" /> },
  ];

  const testimonials: Testimonial[] = [
    { name: 'Ricardo Silva', rating: 5, text: 'O Dr. Alan foi extremamente profissional e atencioso com meu caso trabalhista. Recomendo muito!', date: 'há 2 meses' },
    { name: 'Maria Oliveira', rating: 5, text: 'Excelente atendimento. Resolveu meu inventário com muita agilidade e transparência.', date: 'há 4 meses' },
    { name: 'João Santos', rating: 5, text: 'O melhor escritório de Brumado. Atendimento humanizado e resultados concretos.', date: 'há 1 mês' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000" 
            alt="Escritório de Advocacia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-blue-900/60"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-blue-700/50 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
              Tradição e Modernidade em Brumado
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Excelência e Compromisso com seus <span className="text-blue-400">Direitos</span>.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
              Oferecemos soluções jurídicas personalizadas com ética, transparência e o foco total na resolução dos seus conflitos.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="https://wa.me/5577999913556" 
                target="_blank"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Agendar Consulta <ChevronRight className="ml-2 w-5 h-5" />
              </a>
              <a 
                href="#practice" 
                className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-lg font-bold transition-all backdrop-blur-sm flex items-center justify-center"
              >
                Conhecer Áreas
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-white py-12 border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-900 mb-1">5.0</p>
              <div className="flex justify-center text-yellow-400 mb-1">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Avaliação Google</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900 mb-1">+100</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Casos Resolvidos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900 mb-1">24h</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Suporte via WhatsApp</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900 mb-1">Brumado</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Atendimento Presencial</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-lg -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-900/10 rounded-lg -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=800" 
                alt="Alan Wesdra"
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-blue-950 mb-6">Advocacia de Alto Padrão em Brumado e Região</h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                O escritório <strong>Alan Wesdra Advocacia e Consultoria Jurídica</strong> nasceu com a missão de oferecer um serviço jurídico diferenciado, onde a agilidade e o atendimento humano caminham lado a lado.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Entendemos que cada processo não é apenas um número, mas a vida e o patrimônio de nossos clientes. Por isso, investimos em atualização constante e tecnologia para garantir a melhor defesa técnica possível em Brumado - BA.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  'Ética e Sigilo Absoluto',
                  'Atendimento Personalizado',
                  'Transparência no Acompanhamento Processual',
                  'Foco em Resultados Extrajudiciais e Judiciais'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 font-medium">
                    <div className="bg-blue-100 text-blue-600 p-1 rounded-full mr-3">
                      <ShieldCheck size={18} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <button className="text-blue-700 font-bold border-b-2 border-blue-700 pb-1 hover:text-blue-900 hover:border-blue-900 transition-all">
                Conheça nossa trajetória completa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="practice" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-blue-950 mb-4">Áreas de Especialização</h2>
            <p className="text-slate-500">Soluções jurídicas integradas para pessoas físicas e jurídicas em diversas ramificações do Direito.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceAreas.map((area, i) => (
              <div 
                key={i} 
                className="group p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-950 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="text-blue-700 mb-6 group-hover:text-blue-400 transition-colors">
                  {area.icon}
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-4 group-hover:text-white transition-colors">
                  {area.title}
                </h3>
                <p className="text-slate-600 group-hover:text-slate-300 transition-colors leading-relaxed">
                  {area.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-bold text-blue-700 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                  Saber mais <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-blue-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <Scale size={400} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que dizem nossos clientes</h2>
            <div className="flex justify-center items-center space-x-2 text-yellow-400 mb-4">
              <Star fill="currentColor" />
              <Star fill="currentColor" />
              <Star fill="currentColor" />
              <Star fill="currentColor" />
              <Star fill="currentColor" />
              <span className="text-white ml-2 text-sm">5.0 no Google</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-blue-900/40 backdrop-blur-md p-8 rounded-2xl border border-blue-800/50">
                <Quote className="text-blue-400 mb-6 w-10 h-10" />
                <p className="text-blue-100 mb-8 italic text-lg">"{t.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-blue-300 font-bold text-xl mr-4 uppercase">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-blue-300 uppercase tracking-widest">{t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="https://www.google.com/maps/place/Alan+Wesdra+Advocacia+e+Consultoria+Jur%C3%ADdica" 
              target="_blank"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-white transition-colors"
            >
              <span>Ver todas as avaliações no Google</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-blue-950 mb-8">Fale Conosco</h2>
              <p className="text-slate-600 mb-12 text-lg">
                Seja para agendar uma consulta presencial ou tirar dúvidas rápidas, estamos prontos para lhe atender com total dedicação.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-900 p-3 rounded-lg mr-4">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 mb-1">Localização</h4>
                    <p className="text-slate-600">Av. João Paulo I, 764 - Nobre, Brumado - BA, 46100-000</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-900 p-3 rounded-lg mr-4">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 mb-1">Contato</h4>
                    <p className="text-slate-600">(77) 99991-3556</p>
                    <p className="text-slate-600">contato@alanwesdra.com.br</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-900 p-3 rounded-lg mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 mb-1">Horário de Atendimento</h4>
                    <p className="text-slate-600">Segunda à Sexta: 08:00 às 18:00</p>
                    <p className="text-blue-600 text-sm font-medium">Aberto agora</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <a 
                  href="https://wa.me/5577999913556" 
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all transform hover:scale-105"
                >
                  <MessageSquare className="mr-2" /> Iniciar Conversa no WhatsApp
                </a>
              </div>
            </div>
            
            <div className="bg-slate-100 rounded-2xl overflow-hidden min-h-[400px] border border-slate-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.585572562153!2d-41.6705786!3d-14.2188613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7460e5396558661%3A0x67394d930f78d9b1!2sAv.%20Jo%C3%A3o%20Paulo%20I%2C%20764%20-%20Nobre%2C%20Brumado%20-%20BA%2C%2046100-000!5e0!3m2!1sen!2sbr!4v1710000000000!5m2!1sen!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12 border-t border-blue-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <Scale className="h-8 w-8 text-blue-400" />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold leading-none">ALAN WESDRA</span>
                <span className="text-[10px] tracking-widest font-medium text-blue-400">ADVOCACIA & CONSULTORIA</span>
              </div>
            </div>
            
            <div className="flex space-x-8 mb-8 md:mb-0 text-sm font-medium text-blue-200">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">OAB/BA</a>
            </div>

            <div className="text-slate-400 text-sm text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} Alan Wesdra Advocacia.</p>
              <p className="mt-1">Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chat Bot Floating Button */}
      <ChatBot />
    </div>
  );
};

export default App;
