import { useState, useEffect, useContext } from 'react'; // Agregamos useContext
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'; // Agregamos TouchableOpacity
import { AppContext } from '../context/AppContext'; // Importamos el contexto

export default function Pokemon({ route }) {
  const { nombre } = route.params; // Obtener el nombre del Pokémon
  const [pokemon, setPokemon] = useState(null);
  const { favoritos, setFavoritos } = useContext(AppContext); // Accedemos al contexto

  useEffect(() => {
    const obtenerPokemon = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
      const data = await res.json();
      setPokemon(data);
    };
    obtenerPokemon();
  }, [nombre]);

  const esFavorito = favoritos.some(p => p.id === pokemon?.id); // Verificar si es favorito
  const toggleFavorito = () => {
    if (!pokemon) return;
    if (esFavorito) {
      setFavoritos(favoritos.filter(p => p.id !== pokemon.id)); // Eliminar de favoritos
    } else {
      setFavoritos([...favoritos, { id: pokemon.id, nombre: pokemon.name }]); // Agregar a favoritos
    }
  };

  if (!pokemon) return <Text>Cargando...</Text>;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titulo}>{pokemon.name}</Text>
        <Image
          source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
          style={styles.imagen}
        />
        <Text>Tipo(s): {pokemon.types.map(t => t.type.name).join(', ')}</Text>
        <Text>Altura: {pokemon.height / 10} m / Peso: {pokemon.weight / 10} kg</Text>
        {/* Botón para agregar/eliminar de favoritos */}
        <TouchableOpacity onPress={toggleFavorito} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 32 }}>{esFavorito ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagen: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});