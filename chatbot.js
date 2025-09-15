// Chatbot functionality with interactive admin capabilities with admin capabilities
let isAdminMode = false;
let adminPassword = '15405681540568'; // Same as the main admin password

function initializeChatbot() {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotBox = document.querySelector('.chatbot-box');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSend = document.querySelector('.chatbot-send');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const languageSelect = document.getElementById('chatbot-language-select');

    // Toggle chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotBox.classList.toggle('active');
        chatbotInput.focus();
        if (!chatbotBox.classList.contains('active')) {
            chatbotInput.value = '';
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotBox.classList.remove('active');
        chatbotInput.value = '';
    });

    // Send message on enter
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatbotInput.value.trim()) {
            handleChatbotMessage(chatbotInput.value.trim());
        }
    });

    // Send message on button click
    chatbotSend.addEventListener('click', () => {
        if (chatbotInput.value.trim()) {
            handleChatbotMessage(chatbotInput.value.trim());
        }
    });

    // Send welcome message with language selection
    setTimeout(() => {
        const languageOptions = [
            "1. English",
            "2. Kiswahili (Swahili)",
            "3. Dholuo (Luo)",
            "4. Ekegusii (Kisii)",
            "5. Luluhya (Luhya)",
            "6. Kalenjin",
            "7. Kikamba (Kamba)"
        ].join('\n');
        
        addBotMessage("Welcome! Please choose your preferred language by typing its number:\n\n" + languageOptions);
    }, 1000);
}

let selectedLanguage = null;

function handleChatbotMessage(userMessage) {
    // Display user message
    addUserMessage(userMessage);

    // Handle language selection if not yet selected
    if (!selectedLanguage) {
        const languageMap = {
            '1': 'en',
            '2': 'sw',
            '3': 'luo',
            '4': 'kisii',
            '5': 'luhya',
            '6': 'kalenjin',
            '7': 'kamba'
        };

        if (languageMap[userMessage]) {
            selectedLanguage = languageMap[userMessage];
            const welcomeMessage = getChatbotResponse("creator", selectedLanguage);
            addBotMessage(welcomeMessage);
            return;
        } else {
            addBotMessage("Please select a valid language number (1-7).");
            return;
        }
    }

    // Check if user wants to change language
    if (userMessage.toLowerCase().includes('change language') || userMessage.toLowerCase().includes('switch language')) {
        const languageOptions = [
            "1. English",
            "2. Kiswahili (Swahili)",
            "3. Dholuo (Luo)",
            "4. Ekegusii (Kisii)",
            "5. Luluhya (Luhya)",
            "6. Kalenjin",
            "7. Kikamba (Kamba)"
        ].join('\n');
        
        addBotMessage("Please choose your preferred language by typing its number:\n\n" + languageOptions);
        selectedLanguage = null;
        return;
    }

    // Use the selected language for response
    const response = getChatbotResponse(userMessage.toLowerCase(), selectedLanguage);

    // Add bot response with a slight delay
    setTimeout(() => {
        addBotMessage(response);
    }, 500);

}

function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user-message';
    messageDiv.textContent = message;
    document.querySelector('.chatbot-messages').appendChild(messageDiv);
    scrollChatToBottom();
}

function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot-message';
    messageDiv.textContent = message;
    document.querySelector('.chatbot-messages').appendChild(messageDiv);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const chatMessages = document.querySelector('.chatbot-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to get store information from the page
function getStoreInfo() {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const products = {};
    categories.forEach(category => {
        products[category] = JSON.parse(localStorage.getItem('items_' + category) || '[]');
    });

    const announcements = document.querySelector('.announcement-text')?.textContent || '';
    const storeTitle = document.querySelector('.store-title')?.textContent || 'Ochola Superstore';
    const storeLocation = document.querySelector('.location-info')?.textContent || '';
    
    // Get service numbers from the page
    const serviceNumbers = {};
    document.querySelectorAll('.location-contact a').forEach(contact => {
        const type = contact.className.includes('whatsapp') ? 'WhatsApp' :
                    contact.className.includes('call') ? 'Phone' :
                    'Contact';
        serviceNumbers[type] = contact.href.includes('tel:') ? 
            contact.href.replace('tel:', '') : 
            contact.href.includes('whatsapp') ? 
                contact.href.split('phone=')[1]?.split('&')[0] : 
                contact.href;
    });

    return {
        title: storeTitle,
        announcements,
        location: storeLocation,
        categories,
        products,
        contacts: serviceNumbers
    };
}

function getChatbotResponse(message, lang = 'en') {
    const storeInfo = getStoreInfo();
    
    // Handle announcements query
    if (message.includes('announcement') || message.includes('news') || message.includes('updates')) {
        if (storeInfo.announcements) {
            if (lang === 'sw') return `Tangazo la sasa: ${storeInfo.announcements}`;
            if (lang === 'luo') return `Wach ma nyien: ${storeInfo.announcements}`;
            if (lang === 'kisii') return `Ogosimbwa igoro: ${storeInfo.announcements}`;
            if (lang === 'luhya') return `Amakhuwa amapya: ${storeInfo.announcements}`;
            if (lang === 'kalenjin') return `Longeet netinye: ${storeInfo.announcements}`;
            if (lang === 'kamba') return `Ndeto sya indi: ${storeInfo.announcements}`;
            return `Current announcement: ${storeInfo.announcements}`;
        }
    }

    // Check for keywords in the message
    // Friendly greeting detection
    const greetingsEn = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'welcome'];
    const greetingsSw = ['habari', 'shikamoo', 'mambo', 'salama', 'karibu', 'asubuhi njema', 'jioni njema', 'mchana mwema', 'vipi'];
    const greetingsLuo = ['amosi', 'ber', 'oya', 'wak', 'kony', 'erokamano', 'misawa', 'mos', 'kendu', 'kwayo'];
    const greetingsKisii = ['bweya', 'bwakire', 'bwairire', 'bwabere', 'chinyora', 'omogaka', 'omongina', 'egento', 'egeni'];
    const greetingsLuhya = ['mulembe', 'wakhana', 'wamasika', 'wabona', 'wakhasi'];
    const greetingsKalenjin = ['chamgei', 'kongoi', 'amoche', 'kiptaiya', 'kibendi'];
    const greetingsKamba = ['wikwesa', 'mwaitu', 'mbesa'];
    let isGreeting = false;
    greetingsEn.forEach(g => { if (message.includes(g)) isGreeting = true; });
    greetingsSw.forEach(g => { if (message.includes(g)) isGreeting = true; });
    greetingsLuo.forEach(g => { if (message.includes(g)) isGreeting = true; });
    greetingsKisii.forEach(g => { if (message.includes(g)) isGreeting = true; });
    greetingsLuhya.forEach(g => { if (message.includes(g)) isGreeting = true; });
    greetingsKalenjin.forEach(g => { if (message.includes(g)) isGreeting = true; });
    greetingsKamba.forEach(g => { if (message.includes(g)) isGreeting = true; });
    if (isGreeting) {
        switch(lang) {
            case 'sw': return "Karibu sana! 😊 Nipo hapa kukusaidia kwa chochote unachohitaji. Unaweza kuuliza swali lolote au kutaja huduma unayotaka.";
            case 'luo': return "Oyawore, ber ahinya! 😊 An gi tich mar konyi kuom gimoro amora ma idwaro. Inyalo penja penjo moro amora kata yudo kony kuom tich moro amora.";
            case 'kisii': return "Bweya mono! 😊 Ninde ase ogosaidia. Omonyare komboria chindu chionsi: ebinto biaito, aaria ture, ogotumia esimi, gose ase ogoika.";
            case 'luhya': return "Mulembe muno! 😊 Ndi ano okhukhuyeta. Unyala okhumbola shiosi: ebindu byefu, esiro yefu, namwe okhushibila esimi.";
            case 'kalenjin': return "Chamgei mising! 😊 Amitwok anyun akonyok. Imuche isom kiy age tugul: products chechu, ole kimine, order, akobo simu.";
            case 'kamba': return "Wikwenda! 😊 Ninengiwe wia wa kukwatethya. No undavya undu wonthe: indo syitu, vala tui, undu wa kuua, kana namba sya simu.";
            default: return "Welcome! 😊 I'm here to help you with anything you need. Feel free to ask any question or mention a service you want.";
        }
    } else if (message.includes('list') && message.includes('categories')) {
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        if (categories.length === 0) {
            if (lang === 'sw') return "Samahani, hakuna makundi yanayopatikana sasa.";
            if (lang === 'luo') return "Ooyo, onge kategori manok tich.";
            if (lang === 'kisii') return "Naki, tari kategori kororekana igoro iga.";
            if (lang === 'luhya') return "Sambi, shirano shiosi shiorakho okhulerero.";
            if (lang === 'kalenjin') return "Mising, categories che mami kotinye nguni.";
            if (lang === 'kamba') return "Mwete, vatonyaa kuoneka vala indi.";
            return "Sorry, no categories are available at the moment.";
        }
        if (lang === 'sw') return "Haya ndiyo makundi yetu:\n" + categories.join('\n');
        if (lang === 'luo') return "Kategori manok tich wa:\n" + categories.join('\n');
        if (lang === 'kisii') return "Chino niche kategori chiaito:\n" + categories.join('\n');
        if (lang === 'luhya') return "Shino shirano sheefwe:\n" + categories.join('\n');
        if (lang === 'kalenjin') return "Ni categories chechu:\n" + categories.join('\n');
        if (lang === 'kamba') return "Ii ni vala syitu:\n" + categories.join('\n');
        return "Here are our available categories:\n" + categories.join('\n');
    } else if (message.includes('products') || message.includes('items')) {
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        if (categories.length === 0) {
            if (lang === 'sw') return "Samahani, hakuna bidhaa zinazopatikana sasa.";
            if (lang === 'luo') return "Ooyo, onge ngima manok tich.";
            if (lang === 'kisii') return "Naki, tari ebinto biakorora igoro iga.";
            if (lang === 'luhya') return "Sambi, eshiindu shiosi shiorakho okhulerero.";
            if (lang === 'kalenjin') return "Mising, products che mami kotinye nguni.";
            if (lang === 'kamba') return "Mwete, vatonyaa kuoneka indo indi.";
            return "Sorry, no products are available at the moment.";
        }
        
        // Check if asking about specific category
        const categoryMatch = categories.find(cat => message.toLowerCase().includes(cat.toLowerCase()));
        if (categoryMatch) {
            const items = JSON.parse(localStorage.getItem('items_' + categoryMatch) || '[]');
            if (items.length === 0) {
                if (lang === 'sw') return `Hakuna bidhaa kwenye kundi la ${categoryMatch}.`;
                if (lang === 'luo') return `Onge ngima e kategori ${categoryMatch}.`;
                if (lang === 'kisii') return `Tari ebinto bie kategori ya ${categoryMatch}.`;
                if (lang === 'luhya') return `Eshiindu shiosi shiorakho mukhutaru khwa ${categoryMatch}.`;
                if (lang === 'kalenjin') return `Mami products che mi category nebo ${categoryMatch}.`;
                if (lang === 'kamba') return `Vatonyaa kuoneka indo sya ${categoryMatch}.`;
                return `No products available in ${categoryMatch} category.`;
            }
            const itemList = items.map(item => {
                if (typeof item === 'object') {
                    const priceInfo = item.priceOptions ? 
                        ` (${item.priceOptions.map(p => `${p.description}: Ksh ${p.price}`).join(', ')})` : '';
                    return `- ${item.name}${priceInfo}`;
                }
                return `- ${item}`;
            });
            if (lang === 'sw') return `Bidhaa kwenye kundi la ${categoryMatch}:\n${itemList.join('\n')}`;
            if (lang === 'luo') return `Ngima e kategori ${categoryMatch}:\n${itemList.join('\n')}`;
            if (lang === 'kisii') return `Ebinto bie kategori ya ${categoryMatch}:\n${itemList.join('\n')}`;
            if (lang === 'luhya') return `Eshiindu sha khutaru khwa ${categoryMatch}:\n${itemList.join('\n')}`;
            if (lang === 'kalenjin') return `Products che mi category nebo ${categoryMatch}:\n${itemList.join('\n')}`;
            if (lang === 'kamba') return `Indo sya ${categoryMatch}:\n${itemList.join('\n')}`;
            return `Products in ${categoryMatch} category:\n${itemList.join('\n')}`;
        }
        
        // If no specific category mentioned, list all products by category
    let response = "";
    if (lang === 'sw') response = "Bidhaa zetu kwa makundi:\n\n";
    else if (lang === 'luo') response = "Ngima wa kategori manok tich:\n\n";
    else if (lang === 'kisii') response = "Ebinto biaito kwa kategori:\n\n";
    else if (lang === 'luhya') response = "Eshiindu sheefwe khukhutara:\n\n";
    else if (lang === 'kalenjin') response = "Products chechu eng categories:\n\n";
    else if (lang === 'kamba') response = "Indo syitu kwa vala:\n\n";
    else response = "Here are our products by category:\n\n";
        for (const category of categories) {
            const items = JSON.parse(localStorage.getItem('items_' + category) || '[]');
            if (items.length > 0) {
                response += `${category}:\n`;
                items.forEach(item => {
                    if (typeof item === 'object') {
                        const priceInfo = item.priceOptions ? 
                            ` (${item.priceOptions.map(p => `${p.description}: Ksh ${p.price}`).join(', ')})` : '';
                        response += `- ${item.name}${priceInfo}\n`;
                    } else {
                        response += `- ${item}\n`;
                    }
                });
                response += '\n';
            }
        }
    return response.trim();
    } else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        for (const category of categories) {
            const items = JSON.parse(localStorage.getItem('items_' + category) || '[]');
            for (const item of items) {
                const itemName = typeof item === 'object' ? item.name : item;
                if (message.toLowerCase().includes(itemName.toLowerCase())) {
                    if (typeof item === 'object' && item.priceOptions) {
                        const prices = item.priceOptions.map(p => `${p.description}: Ksh ${p.price}`).join('\n');
                        return `Prices for ${itemName}:\n${prices}`;
                    }
                    return `${itemName} prices vary. Please click on the item in the product list to see current prices.`;
                }
            }
        }
    if (lang === 'sw') return "Tafadhali taja bidhaa unayotaka kujua bei, au angalia makundi yetu kuona bei za bidhaa zote.";
    if (lang === 'luo') return "Nyisa ngima ma idwaro neno pesa, kata yud kategori wa mondo inen pesa mag ngima duto.";
    if (lang === 'kisii') return "Tari korora ebinto bionsi na bei yabio, gose tara kategori yonsi korora ebinto na bei yabio.";
    if (lang === 'luhya') return "Khulanga eshiindu shoshosi nende ebeeyi yashio, namwe ulole mukhutaru khwosi khulola ebeeyi yashio.";
    if (lang === 'kalenjin') return "Ibwat product ne imuche iyai price, akoreet ile categories kosere products tugul ak prices.";
    if (lang === 'kamba') return "Neena indo iiya withiwa na mbesa syayo, kana vika vala vonthe kwi ona indo na mbesa syasyo.";
    return "Please specify which product you'd like to know the price for, or browse our categories to see all products and their prices.";
    } else if (
        message.includes('contact') ||
        message.includes('phone') ||
        message.includes('whatsapp') ||
        message.includes('call') ||
        message.includes('number')
    ) {
        // Extract location from message if present
        // Try to extract location from message
        const locationRegex = /(location|branch|store)\s*:?\s*([\w\s]+)/i;
        const match = message.match(locationRegex);
        let locationName = null;
        if (match && match[2]) locationName = match[2].trim();
        // Get location contacts from localStorage
        const defaultNumber = '254791941974';
        const locations = JSON.parse(localStorage.getItem('store_locations') || '[]');
        let contact = defaultNumber;
        let foundLocation = null;
        if (locationName) {
            foundLocation = locations.find(l => l.name.toLowerCase() === locationName.toLowerCase());
            if (foundLocation) {
                if (foundLocation.call) contact = foundLocation.call;
                else if (foundLocation.whatsapp) contact = foundLocation.whatsapp;
            }
        }
        if (locationName && foundLocation) {
            let contactDetails = [];
            if (foundLocation.call) contactDetails.push(`Call: ${foundLocation.call}`);
            if (foundLocation.whatsapp) contactDetails.push(`WhatsApp: ${foundLocation.whatsapp}`);
            if (contactDetails.length > 0) {
                return `Contacts for ${locationName}:\n${contactDetails.join('\n')}\n\nFor further assistance, feel free to call or send a message!`;
            } else {
                return `No contact details found for ${locationName}. If you need help, please call or send a message to the store owner at ${defaultNumber}.`;
            }
        } else if (locationName && !foundLocation) {
            return `No location named '${locationName}' found. For further assistance, please call or send a message to the store owner at ${defaultNumber}.`;
        } else {
            return `The store owner's contact is ${contact}. For further assistance, feel free to call or send him a message!`;
        }
    } else if (message.includes('location') || message.includes('address') || message.includes('where')) {
    if (lang === 'sw') return "Duka letu lipo katika chumba nambari 19, Jengo la Tamasha One, karibu na Jengo la Forestview, Cheptulu, Kaimosi. Bonyeza kitufe cha 'Mahali Tulipo' ili kupata maelekezo zaidi au kufungua ramani kwenye Google Maps.";
    if (lang === 'luo') return "Duka marwa ni e ot namba 19, e ot maduong' mar Tamasha One, machiegni gi ot mar Forestview e Cheptulu, Kaimosi. Dhi e 'Store Location' mondo iyud weche momedore kata iyaw Google Maps.";
    if (lang === 'kisii') return "Egetanda kiaito nkere enyomba namba 19, ase enyomba ende ya Tamasha One, egere na enyomba ya Forestview, Cheptulu, Kaimosi. Bunya 'Store Location' kworora aaria ture ase Google Maps.";
    if (lang === 'luhya') return "Eshituka shiefu shili munyumba nomba 19, munyumba enene ya Tamasha One, huliraani ne nyumba ya Forestview mu Cheptulu, Kaimosi. Diira 'Store Location' okhulola esiro yefu mu Google Maps.";
    if (lang === 'kalenjin') return "Store nechu ko kot namba 19, ko kot ne o Tamasha One, kochengei kot ne bo Forestview ko Cheptulu, Kaimosi. Itech 'Store Location' kosere wolunet komie ak Google Maps.";
    if (lang === 'kamba') return "Kivanda kitu ki nyumba namba 19, nyumba ya Tamasha One, vakuvii na nyumba ya Forestview, Cheptulu, Kaimosi. Vinya 'Store Location' kwi ona vala tui kwa Google Maps.";
    return "Our store is located at Door Number 19, Tamasha One Building, adjacent to Forestview Building in Cheptulu, Kaimosi. You can click the 'Store Location' button for more details or to open in Google Maps.";
    } else if (message.includes('contact') || message.includes('phone') || message.includes('whatsapp') || message.includes('call')) {
        return "You can contact us through WhatsApp or phone call. Just click the 'WhatsApp' or 'Call Us' button on the main page.";
    } else if (message.includes('order') || message.includes('ordering')) {
    if (lang === 'sw') return "Jinsi ya kuagiza: 1. Chagua kundi la bidhaa unazotaka 2. Chagua bidhaa mahususi 3. Weka kiasi na maelezo ya ziada 4. Tuma ujumbe kupitia WhatsApp au piga simu moja kwa moja.";
    if (lang === 'luo') return "Kaka inyalo chako ng'iewo gik: 1. Yier kit gima idwaro 2. Yier gima idwaro 3. Kwan pesa gi weche mamoko 4. Or WhatsApp kata go simu.";
    if (lang === 'kisii') return "Ase ogoagera: 1. Tara ebinto biria okogenda koagera 2. Tara ekiagera kende 3. Tara ebiiti na amasakara aonde 4. Tuma mesegi ase WhatsApp gose otebe simu bwango bwango.";
    if (lang === 'luhya') return "Okhuhela ebindu: 1. Lola khulwe shirano shia ebindu 2. Lola eshindu shioshenda okhuhela 3. Andika obukusi nende amafunwa kandi 4. Tuma omusatsa khulwe WhatsApp namwe okhwilanga muno muno.";
    if (lang === 'kalenjin') return "Oret nebo order: 1. Iyier category nebo product 2. Iyier product ne imoche 3. Isir melekto ak ibwat description 4. Itoki eng WhatsApp akoreet itoki direct eng simu.";
    if (lang === 'kamba') return "Undu wa kuua indo: 1. Sakua kikundani kya indo 2. Sakua indo ila wendete 3. Andika mbesa na uvoo ungi 4. Tuma kwa WhatsApp kana ukune simu nguvi.";
    return "To place an order: 1. Select a product category 2. Choose your item 3. Enter the amount and description 4. Choose to either send via WhatsApp or call us directly.";
    } else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
    if (lang === 'sw') return "Bei ya kila bidhaa ni tofauti. Tafadhali chagua kundi na ubonyeze bidhaa yoyote kuona bei yake. Kwa baadhi ya bidhaa, unaweza pia kuweka kiasi chako mwenyewe.";
    if (lang === 'luo') return "Nengo opogore kaluwore gi kit gima idwaro. Yier kit gima idwaro mondo ine nengo mar gik manie kano. E moko kuom gigo inyalo keto nengo ma in iwuon idwaro.";
    if (lang === 'kisii') return "Obonge botofautieni koreng'ana nebinto. Tara kategori na obunye ekinto korora obonge. Noinyara kwatara obonge ototagete ase ebinto binde.";
    if (lang === 'luhya') return "Ebeeyi yiakana neshiindu. Lola mukhutaru khwo eshiindu khulola ebeeyi. Unyala okhwandika ebeeyi yiakana neshiindu shiosi.";
    if (lang === 'kalenjin') return "Price walak eng products. Select category ak product kosere prices. Imuche ibwat price nebo items alake.";
    if (lang === 'kamba') return "Mbesa syithiawa na tofauti kwa kila indo. Sakua vala na indo kwi ona mbesa syayo. No utonya kwandika mbesa unendete kwa imwe ya indo.";
    return "Prices vary by product. Select a category and click on any product to see its price options. You can also enter custom amounts for some items.";
    } else if (message.includes('thank')) {
    if (lang === 'sw') return "Karibu! Kuna kitu kingine naweza kusaidia?";
    if (lang === 'luo') return "Erokamano! Bende nitie gimoro ma idwaro konyo gi?";
    if (lang === 'kisii') return "Ayiee! Naki ekindi nainche nkokonye?";
    if (lang === 'luhya') return "Osikhe! Shikhuli shiindi shiosi shiendakhukhukhonia?";
    if (lang === 'kalenjin') return "Kongoi! Miten kiy age nebo konyin?";
    if (lang === 'kamba') return "Ni mbee! Kwa undu ungi ningukutetheesya?";
    return "You're welcome! Is there anything else I can help you with?";
    } else if (message.includes('bye') || message.includes('goodbye')) {
    if (lang === 'sw') return "Kwaheri! Usisite kurudi ukiwa na maswali zaidi!";
    if (lang === 'luo') return "Kwayo! Bi wabiro ka in gi penjo mamoko!";
    if (lang === 'kisii') return "Genda buya! Koira gochaka kore na amaswari aande!";
    if (lang === 'luhya') return "Wakhana! Witse khandi nolakhulanga khandi!";
    if (lang === 'kalenjin') return "Saisere! Chomchi missing kobo kipendi!";
    if (lang === 'kamba') return "Ni wendo! Uka ungi withiwa na makulyo ungi!";
    return "Goodbye! Feel free to come back if you have more questions!";
    } else if (message.includes('creator') || message.includes('developer') || message.includes('who made') || message.includes('who created')) {
    if (lang === 'sw') return "Nimetengenezwa na Ochola Chrisphine kama msaidizi wa duka. Naweza kukusaidia vipi leo?";
    if (lang === 'luo') return "Ochola Chrisphine ema ochweyo chatbot ma okonyi e ot. Bende nitie gimoro ma idwaro konyo gi?";
    if (lang === 'kisii') return "Ochola Chrisphine nao ogotenengereria chatbot eye egetanda. Ninche ngokoonye ing'ai rero?";
    if (lang === 'luhya') return "Ochola Chrisphine niye okhwomba chatbot ino yekhukhukhonia mumagasi. Nanyala okhukhukhonia warie rero?";
    if (lang === 'kalenjin') return "Ochola Chrisphine kogerchi chatbot ni nebo konyin eng store. Anyun ani nebo konyin rani?";
    if (lang === 'kamba') return "Ochola Chrisphine niwe wathondeka chatbot ino ya kwaku kivanda. Ni undu mwau ningukutetheesya umunthi?";
    return "I was created by Ochola Chrisphine as your helpful store assistant. How can I assist you today?";
    } else if (message.includes('open') || message.includes('close') || message.includes('hours') || message.includes('time')) {
        // Store hours response
        if (lang === 'sw') return "Duka letu huwa wazi kuanzia saa mbili asubuhi (8:00 AM) hadi saa moja jioni (7:00 PM) kila siku. Tunafanya kazi siku saba kwa wiki, bila kufunga.";
        if (lang === 'luo') return "Duka wayawo chakre sa ariyo mar okinyi (8:00 AM) nyaka sa achiel mar odhiambo (7:00 PM) pile pile. Watiyo ndalo duto mag juma ka ok wadeko.";
        if (lang === 'kisii') return "Egetanda kiaito kiagoigora kera rituko korwa esaa ibere mambia (8:00 AM) goika esaa eyemo ya mogoroba (7:00 PM). Twatiga egasi kera rituko, amatuko goika omogoko gose chiumaite chionsi.";
        if (lang === 'luhya') return "Eshituka shiefu shilangukha eshiteera (8:00 AM) okhutsia eshiokhe mukhuloba (7:00 PM) buli lusiku. Khuba nende emilimo buli lusiku, shibula khwibala tawe.";
        if (lang === 'kalenjin') return "Store nechu kotinyei saet nebo kipagenge kochakta saet robgei (8:00 AM) agoi saet nebo koimen (7:00 PM) betut age tugul. Keyai tich wikit tugul, matoktos.";
        if (lang === 'kamba') return "Kivanda kitu kikoaa kuuma saa ili ya kwakya (8:00 AM) nginya saa mwei ya uthuko (7:00 PM) kila muthenya. Tui wiani mithenya yonthe ya wiki, tutiwendaa kumya.";
        return "Our store is open from 8:00 AM to 7:00 PM every day. We are open seven days a week.";
    } else {
        // Get available topics from store info
        const storeInfo = getStoreInfo();
        const topics = [
            storeInfo.categories.length > 0 ? 'products' : null,
            storeInfo.location ? 'store location' : null,
            storeInfo.contacts ? 'contact information' : null,
            'opening hours',
            'how to order',
            storeInfo.announcements ? 'current announcements' : null,
        ].filter(topic => topic !== null);

        if (lang === 'sw') return `Samahani, sijaelewa. Unaweza kuniuliza kuhusu: ${topics.join(', ')}. Naweza kukusaidia vipi?`;
        if (lang === 'luo') return `Ooyo, ok anang'o mano. Inyalo penja kuom: ${topics.join(', ')}. Bende nitie gimoro ma idwaro konyo gi?`;
        if (lang === 'kisii') return `Naki, tindategereti. Noinyara komonkia igoro ya: ${topics.join(', ')}. Ninche ngokonye ing'ai?`;
        if (lang === 'luhya') return `Sambi, shikhulimanyile. Unyala okhulanga khulwe: ${topics.join(', ')}. Nanyala okhukhukhonia warie?`;
        if (lang === 'kalenjin') return `Mising, malel ayai. Imuche isom about: ${topics.join(', ')}. Anyun ani nebo konyin?`;
        if (lang === 'kamba') return `Mwete, ndikwata. No undavya kwi: ${topics.join(', ')}. Ni undu mwau ningukutetheesya?`;
        return `I'm not sure about that. You can ask me about: ${topics.join(', ')}. How can I help you?`;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChatbot);