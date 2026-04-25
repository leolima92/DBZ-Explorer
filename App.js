import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, FlatList, Image, Modal, Platform,
    SafeAreaView, ScrollView, StatusBar, StyleSheet,
    Text, TextInput, TouchableOpacity, View,
} from 'react-native';

// ===== CORES E TRADUÇÕES =====
//IA: Solicitei ao Claude uma paleta de cores para cada raça do anime

const CORES = {
    Saiyajin: '#F59E0B', Namekuseijin: '#10B981', Humano: '#3B82F6',
    Androide: '#8B5CF6', 'Raça Frieza': '#EF4444', Deus: '#EC4899',
    Anjo: '#06B6D4', Maligno: '#DC2626', Majin: '#E879F9',
    Kaioshin: '#14B8A6', Desconhecido: '#6B7280', 'Alien Desconhecido': '#F97316',
};

const getRaceColor = (r) => CORES[r] || '#6B7280';


// a API classifica alguns personagens com raça errada
const ALIENS = ['Zarbon', 'Dodoria', 'Ginyu', 'Toppo', 'Dyspo'];
const RACA_FIXA = { 'Kibito-Shin': 'Kaioshin', 'Vermoudh': 'Deus' };

const traduzirRaca = (race, nome) => {
    if (nome && RACA_FIXA[nome]) return RACA_FIXA[nome];
    if (nome && ALIENS.includes(nome)) return 'Alien Desconhecido';
    const t = {
        Saiyan: 'Saiyajin', Namekian: 'Namekuseijin', Human: 'Humano',
        Android: 'Androide', 'Frieza Race': 'Raça Frieza', God: 'Deus',
        Angel: 'Anjo', Evil: 'Maligno', Majin: 'Majin',
        Nucleico: 'Kaioshin', 'Nucleico benigno': 'Kaioshin',
        Unknown: 'Desconhecido', 'Jiren Race': 'Alien Desconhecido',
    };
    return t[race] || race;
};

const traduzirAfiliacao = (a) => {
    const t = {
        'Z Fighter': 'Guerreiro Z', 'Z Fighters': 'Guerreiros Z',
        'Red Ribbon Army': 'Exército Red Ribbon', 'Army of Frieza': 'Exército de Frieza',
        Freelancer: 'Independente', Villain: 'Vilão',
        'Assistant of Beerus': 'Assistente de Beerus',
        'Assistant of Vermoud': 'Assistente de Vermoud',
        'God of Destruction': 'Deus da Destruição', 'Pride Troopers': 'Tropas do Orgulho',
    };
    return t[a] || a;
};

const traduzirGenero = (g) =>
    g === 'Male' ? 'Masculino' : g === 'Female' ? 'Feminino' : g || '—';

export default function App() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [selectedChar, setSelectedChar] = useState(null);

    // Utilizei os conceitos da última aula para realizar a chamada da API e usei o Claude para melhorar os tratamentos de loading
    const fetchCharacters = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch('https://dragonball-api.com/api/characters?limit=100');
            if (!res.ok) throw new Error('Erro');
            const data = await res.json();
            setCharacters(data.items || []);
        } catch {
            setError('Não foi possível carregar os personagens. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCharacters(); }, [fetchCharacters]);

    //IA: usei para fazer os filtros usarem a raça traduzida em vez da original da API
    const getRacaTrad = (c) => traduzirRaca(c.race, c.name);
    const races = ['Todos', ...new Set(characters.map(getRacaTrad).filter(Boolean))];

    const filtered = characters.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (activeFilter === 'Todos' || getRacaTrad(c) === activeFilter)
    );

    // Loading
    if (loading) return (
        <SafeAreaView style={s.center}>
            <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
            <ActivityIndicator size="large" color="#F97316" />
            <Text style={s.muted}>Carregando personagens...</Text>
        </SafeAreaView>
    );
    // Erro
    if (error) {
        return (
            <SafeAreaView style={s.center}>
                <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
                <Text style={s.errorText}>{error}</Text>

                <TouchableOpacity style={s.retryBtn} onPress={fetchCharacters}>
                    <Text style={s.retryBtnText}>Tentar novamente</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const renderCharacter = ({ item }) => {
        const cor = getRaceColor(item.race);
        return (
            <TouchableOpacity style={s.card} onPress={() => setSelectedChar(item)} activeOpacity={0.7}>
                <View style={[s.imgBox, { backgroundColor: cor + '15' }]}>
                    <Image source={{ uri: item.image }} style={s.imgSm} resizeMode="contain" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={s.row}>
                        <Text style={s.cardName} numberOfLines={1}>{item.name}</Text>
                        <View style={[s.badge, { backgroundColor: cor + '20' }]}>
                            <Text style={[s.badgeText, { color: cor }]}>{traduzirRaca(item.race, item.name)}</Text>
                        </View>
                    </View>
                    <View style={[s.row, { gap: 16, marginTop: 6 }]}>
                        <View>
                            <Text style={s.label}>KI</Text>
                            <Text style={s.val} numberOfLines={1}>{item.ki}</Text>
                        </View>
                        <View>
                            <Text style={s.label}>MÁX</Text>
                            <Text style={s.val} numberOfLines={1}>{item.maxKi}</Text>
                        </View>
                    </View>
                </View>
                <Text style={{ color: '#333', fontSize: 22 }}>›</Text>
            </TouchableOpacity>
        );
    };

    const sel = selectedChar;

    return (
        <SafeAreaView style={s.container}>
            <StatusBar barStyle="light-content" backgroundColor="#DC2626" />

            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>DRAGON BALL</Text>
                    <Text style={s.headerSub}>Enciclopédia de guerreiros</Text>
                </View>
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: -14, zIndex: 2 }}>
                <View style={s.searchBox}>
                    <TextInput style={s.searchInput} placeholder="Buscar personagem..."
                        placeholderTextColor="#555" value={search} onChangeText={setSearch} />
                    {search !== '' && (
                        <TouchableOpacity onPress={() => setSearch('')} style={s.clearBtn}>
                            <Text style={{ color: '#999', fontSize: 12 }}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={{ marginTop: 16 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                    {races.map((race) => {
                        const on = activeFilter === race;
                        return (
                            <TouchableOpacity key={race} onPress={() => setActiveFilter(race)}
                                style={[s.chip, on && { backgroundColor: race === 'Todos' ? '#F97316' : getRaceColor(race), borderColor: 'transparent', }]}>
                                <Text style={[s.chipText, on && { color: '#fff' }]}>{race}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <Text style={[s.muted, { marginTop: 14, marginBottom: 10, paddingHorizontal: 16 }]}>
                {filtered.length} personagen{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </Text>

            <FlatList data={filtered} keyExtractor={(i) => i.id.toString()} renderItem={renderCharacter}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30, gap: 12 }}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Text style={{ fontSize: 40 }}>🔍</Text>
                        <Text style={[s.muted, { marginTop: 12 }]}>Nenhum personagem encontrado</Text>
                    </View>
                }
            />
            {/* IA: Solicitei ao Claude para criar um layout mais agradável com o retorno da API */}
            <Modal visible={sel !== null} transparent animationType="fade" onRequestClose={() => setSelectedChar(null)}>
                {sel && (
                    <View style={s.overlay}>
                        <View style={s.modal}>
                            <View style={[s.modalHeader, { backgroundColor: getRaceColor(sel.race) + '20' }]}>
                                <TouchableOpacity style={s.closeBtn} onPress={() => setSelectedChar(null)}>
                                    <Text style={{ color: '#999', fontSize: 14 }}>✕</Text>
                                </TouchableOpacity>
                                <View style={[s.imgBoxLg, { backgroundColor: getRaceColor(sel.race) + '15' }]}>
                                    <Image source={{ uri: sel.image }} style={s.imgLg} resizeMode="contain" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.modalName}>{sel.name}</Text>
                                    <View style={[s.badge, { backgroundColor: getRaceColor(sel.race) + '25', marginTop: 6 }]}>
                                        <Text style={[s.badgeText, { color: getRaceColor(sel.race), fontSize: 12 }]}>
                                            {traduzirRaca(sel.race, sel.name)}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <ScrollView style={{ paddingHorizontal: 20 }}>
                                <View style={s.statsGrid}>
                                    {[
                                        { l: 'Ki Atual', v: sel.ki },
                                        { l: 'Ki Máximo', v: sel.maxKi },
                                        { l: 'Gênero', v: traduzirGenero(sel.gender) },
                                        { l: 'Afiliação', v: traduzirAfiliacao(sel.affiliation) },
                                    ].map((st) => (
                                        <View key={st.l} style={s.statBox}>
                                            <Text style={s.label}>{st.l}</Text>
                                            <Text style={[s.val, { color: '#ddd', marginTop: 4 }]}>{st.v || '—'}</Text>
                                        </View>
                                    ))}
                                </View>

                                <Text style={s.label}>DESCRIÇÃO</Text>
                                <Text style={s.desc}>{sel.description || 'Descrição não disponível.'}</Text>
                                {sel.transformations?.length > 0 && (
                                    <View style={{ marginTop: 16 }}>
                                        <Text style={s.label}>TRANSFORMAÇÕES ({sel.transformations.length})</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ gap: 10, paddingBottom: 4, marginTop: 8 }}>
                                            {sel.transformations.map((t, i) => (
                                                <View key={i} style={{ width: 80, alignItems: 'center' }}>
                                                    <View style={[s.transBox, { backgroundColor: getRaceColor(sel.race) + '15' }]}>
                                                        <Image source={{ uri: t.image }} style={s.transImg} resizeMode="contain" />
                                                    </View>
                                                    <Text style={s.transName} numberOfLines={2}>{t.name}</Text>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                                <View style={{ height: 20 }} />
                            </ScrollView>
                        </View>
                    </View>
                )}
            </Modal>
        </SafeAreaView>
    );
}

// ===== ESTILOS =====
const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F0F0F' },
    center: { flex: 1, backgroundColor: '#0F0F0F', justifyContent: 'center', alignItems: 'center', padding: 20 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },

    // Textos reutilizáveis
    muted: { color: '#555', fontSize: 12, fontWeight: '500' },
    errorText: { color: '#EF4444', fontSize: 16, fontWeight: '600', textAlign: 'center' },
    label: { color: '#555', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600', marginBottom: 2 },
    val: { color: '#ccc', fontSize: 13, fontWeight: '600' },
    desc: { color: '#aaa', fontSize: 13, lineHeight: 20 },

    // Header
    header: { backgroundColor: '#DC2626', paddingTop: Platform.OS === 'web' ? 20 : 10, paddingBottom: 18, paddingHorizontal: 20 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 1 },
    headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginTop: 2 },

    // Busca
    searchBox: { backgroundColor: '#1A1A2E', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', elevation: 8 },
    searchInput: { flex: 1, color: '#fff', fontSize: 14, padding: 0, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) },
    clearBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },

    // Filtros
    chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)' },
    chipText: { fontSize: 12, fontWeight: '600', color: '#888' },

    // Retry
    retryBtn: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12, backgroundColor: '#F97316' },
    retryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

    // Card
    card: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    cardName: { color: '#fff', fontSize: 16, fontWeight: '700' },
    badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

    // Imagens (reutilizáveis)
    imgBox: { width: 72, height: 72, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    imgSm: { width: 64, height: 64 },
    imgBoxLg: { width: 90, height: 90, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    imgLg: { width: 80, height: 80 },

    // Modal
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modal: { backgroundColor: '#1A1A2E', borderRadius: 20, width: '100%', maxWidth: 420, maxHeight: '85%', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    modalHeader: { padding: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
    modalName: { color: '#fff', fontSize: 22, fontWeight: '800' },
    closeBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', zIndex: 10 },

    // Stats
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    statBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', width: '47%' },

    // Transformações
    transBox: { width: 64, height: 64, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    transImg: { width: 52, height: 52 },
    transName: { color: '#888', fontSize: 10, fontWeight: '600', marginTop: 6, textAlign: 'center' },
});