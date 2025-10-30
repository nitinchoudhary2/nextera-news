import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, User, LogOut, Plus, 
  Search, TrendingUp, Menu, X, Edit, Trash2,
  BarChart3, Users, FileText
} from 'lucide-react';

const NextEraNews = () => {
  // State Management
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  // Categories
  const categories = [
    'All', 'Breaking News', 'Politics', 'Technology', 
    'Sports', 'Entertainment', 'Business', 'Health', 'Science'
  ];

  // Initialize Data
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('nextEraUsers')) || [
      { 
        id: 1, 
        username: 'admin', 
        password: 'admin123', 
        email: 'admin@nextera.com', 
        isAdmin: true, 
        joinDate: new Date().toISOString(),
        name: 'System Administrator'
      }
    ];
    
    const savedNews = JSON.parse(localStorage.getItem('nextEraNews')) || [
      {
        id: 1,
        title: 'Welcome to NextEra News - The Future of News',
        content: 'NextEra News is a revolutionary platform that brings you the latest and most accurate news from around the world. Our mission is to deliver unbiased, fact-checked news in an engaging format.',
        category: 'Breaking News',
        author: 'Admin',
        authorId: 1,
        date: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop',
        views: 150,
        tags: ['welcome', 'platform', 'news']
      },
      {
        id: 2,
        title: 'Artificial Intelligence Transforming Journalism',
        content: 'AI technology is revolutionizing how news is gathered, written, and distributed. From automated reporting to personalized news feeds, the future of journalism is here.',
        category: 'Technology',
        author: 'Admin',
        authorId: 1,
        date: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        views: 89,
        tags: ['AI', 'technology', 'journalism']
      }
    ];

    const savedLikes = JSON.parse(localStorage.getItem('nextEraLikes')) || {};
    const savedComments = JSON.parse(localStorage.getItem('nextEraComments')) || {};

    setUsers(savedUsers);
    setNews(savedNews);
    setLikes(savedLikes);
    setComments(savedComments);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('nextEraUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nextEraNews', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('nextEraLikes', JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem('nextEraComments', JSON.stringify(comments));
  }, [comments]);

  // User Authentication Functions
  const handleSignup = (userData) => {
    if (users.find(u => u.username === userData.username)) {
      alert('Username already exists! Please choose another one.');
      return;
    }

    if (users.find(u => u.email === userData.email)) {
      alert('Email already registered! Please use another email.');
      return;
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      joinDate: new Date().toISOString(),
      isAdmin: false
    };

    setUsers([...users, newUser]);
    alert('Account created successfully! You can now login.');
    setShowSignup(false);
  };

  const handleLogin = (credentials) => {
    const user = users.find(u => 
      u.username === credentials.username && 
      u.password === credentials.password
    );
    
    if (user) {
      setCurrentUser(user);
      setShowLogin(false);
    } else {
      alert('Invalid username or password!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAdminPanel(false);
  };

  // News Management Functions
  const handleAddNews = (articleData) => {
    if (!currentUser) return;

    const newArticle = {
      ...articleData,
      id: Date.now(),
      author: currentUser.username,
      authorId: currentUser.id,
      date: new Date().toISOString(),
      views: 0,
      tags: articleData.tags || []
    };

    setNews([newArticle, ...news]);
    setShowAddNews(false);
    alert('News published successfully!');
  };

  const handleEditNews = (articleData) => {
    if (!currentUser) return;

    const updatedNews = news.map(article => 
      article.id === editingNews.id 
        ? { ...article, ...articleData, date: new Date().toISOString() }
        : article
    );

    setNews(updatedNews);
    setEditingNews(null);
    alert('News updated successfully!');
  };

  const handleDeleteNews = (newsId) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      setNews(news.filter(article => article.id !== newsId));
      alert('News deleted successfully!');
    }
  };

  // Social Features
  const handleLike = (newsId) => {
    if (!currentUser) {
      alert('Please login to like news!');
      return;
    }

    const userLikes = likes[newsId] || [];
    const hasLiked = userLikes.includes(currentUser.id);

    setLikes({
      ...likes,
      [newsId]: hasLiked 
        ? userLikes.filter(id => id !== currentUser.id)
        : [...userLikes, currentUser.id]
    });
  };

  const handleComment = (newsId, commentText) => {
    if (!currentUser) {
      alert('Please login to comment!');
      return;
    }

    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      text: commentText,
      date: new Date().toISOString()
    };

    setComments({
      ...comments,
      [newsId]: [...(comments[newsId] || []), newComment]
    });
  };

  // Utility Functions
  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (article.tags && article.tags.some(tag => 
                           tag.toLowerCase().includes(searchQuery.toLowerCase())
                         ));
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTrendingNews = () => {
    return [...news]
      .sort((a, b) => (likes[b.id]?.length || 0) - (likes[a.id]?.length || 0))
      .slice(0, 5);
  };

  const getPopularNews = () => {
    return [...news]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  };

  const getStats = () => {
    return {
      totalUsers: users.length,
      totalNews: news.length,
      totalLikes: Object.values(likes).reduce((sum, arr) => sum + arr.length, 0),
      totalComments: Object.values(comments).reduce((sum, arr) => sum + arr.length, 0),
      trendingNews: getTrendingNews().length
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NextEra News
                </h1>
                <p className="text-xs text-gray-500">The Future of News</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold text-sm">{currentUser.name || currentUser.username}</p>
                      <p className="text-xs text-gray-500">
                        {currentUser.isAdmin ? 'Administrator' : 'Member'}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {(currentUser.name || currentUser.username).charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {currentUser.isAdmin && (
                    <>
                      <button
                        onClick={() => setShowAddNews(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 flex items-center space-x-2 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add News</span>
                      </button>
                      <button
                        onClick={() => setShowAdminPanel(true)}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 flex items-center space-x-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(currentUser.name || currentUser.username).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{currentUser.name || currentUser.username}</p>
                      <p className="text-xs text-gray-500">
                        {currentUser.isAdmin ? 'Administrator' : 'Member'}
                      </p>
                    </div>
                  </div>
                  
                  {currentUser.isAdmin && (
                    <>
                      <button
                        onClick={() => { setShowAddNews(true); setMobileMenuOpen(false); }}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 flex items-center space-x-2 justify-center"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add News</span>
                      </button>
                      <button
                        onClick={() => { setShowAdminPanel(true); setMobileMenuOpen(false); }}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 flex items-center space-x-2 justify-center"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 flex items-center space-x-2 justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setShowSignup(true); setMobileMenuOpen(false); }}
                    className="w-full border-2 border-blue-500 text-blue-500 px-4 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* News Feed - 3 columns on large screens */}
          <div className="xl:col-span-3 space-y-6">
            {/* Welcome Message for New Users */}
            {!currentUser && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Welcome to NextEra News!</h2>
                    <p className="opacity-90">Join our community to like, comment, and stay updated with the latest news.</p>
                  </div>
                </div>
              </div>
            )}

            {/* News Articles */}
            {filteredNews.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No News Found</h3>
                <p className="text-gray-500">Try changing your search terms or browse different categories.</p>
              </div>
            ) : (
              filteredNews.map(article => (
                <NewsCard
                  key={article.id}
                  article={article}
                  likes={likes[article.id] || []}
                  comments={comments[article.id] || []}
                  currentUser={currentUser}
                  onLike={() => handleLike(article.id)}
                  onComment={(text) => handleComment(article.id, text)}
                  onEdit={currentUser?.isAdmin ? () => setEditingNews(article) : null}
                  onDelete={currentUser?.isAdmin ? () => handleDeleteNews(article.id) : null}
                />
              ))
            )}
          </div>

          {/* Sidebar - 1 column on large screens */}
          <div className="xl:col-span-1 space-y-6">
            {/* Trending News */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                Trending Now
              </h3>
              <div className="space-y-4">
                {getTrendingNews().map((article, index) => (
                  <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-sm hover:text-blue-600 cursor-pointer line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {(likes[article.id]?.length || 0)} likes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular News */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Most Popular
              </h3>
              <div className="space-y-3">
                {getPopularNews().map(article => (
                  <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold text-sm hover:text-blue-600 cursor-pointer line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {article.views || 0} views • {article.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Platform Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Total Users</span>
                  </span>
                  <span className="font-bold">{getStats().totalUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Total News</span>
                  </span>
                  <span className="font-bold">{getStats().totalNews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Total Likes</span>
                  </span>
                  <span className="font-bold">{getStats().totalLikes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Total Comments</span>
                  </span>
                  <span className="font-bold">{getStats().totalComments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">NextEra News</h2>
                <p className="text-gray-400 text-sm">The Future of News Delivery</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">&copy; 2024 NextEra News. All rights reserved.</p>
              <p className="text-gray-500 text-sm">Built with React & Tailwind CSS</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onSubmit={handleLogin} 
        />
      )}
      
      {showSignup && (
        <SignupModal 
          onClose={() => setShowSignup(false)} 
          onSubmit={handleSignup} 
        />
      )}
      
      {showAddNews && (
        <AddNewsModal 
          onClose={() => setShowAddNews(false)} 
          onSubmit={handleAddNews}
          categories={categories.filter(c => c !== 'All')}
        />
      )}
      
      {editingNews && (
        <EditNewsModal 
          onClose={() => setEditingNews(null)} 
          onSubmit={handleEditNews}
          categories={categories.filter(c => c !== 'All')}
          article={editingNews}
        />
      )}
      
      {showAdminPanel && currentUser?.isAdmin && (
        <AdminPanel 
          onClose={() => setShowAdminPanel(false)}
          news={news}
          users={users}
          stats={getStats()}
          onDeleteNews={handleDeleteNews}
          onEditNews={(article) => setEditingNews(article)}
        />
      )}
    </div>
  );
};

// NewsCard Component
const NewsCard = ({ article, likes, comments, currentUser, onLike, onComment, onEdit, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* News Image */}
      {article.image && (
        <div className="relative">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {article.category}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Article Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {article.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{article.author}</p>
              <p className="text-xs text-gray-500">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          {/* Admin Actions */}
          {onEdit && onDelete && (
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit News"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete News"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Title and Content */}
        <h2 className="text-2xl font-bold mb-3 text-gray-800 hover:text-blue-600 cursor-pointer">
          {article.title}
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">{article.content}</p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map(tag => (
              <span 
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span>👁️ {article.views || 0} views</span>
            <span>❤️ {likes.length} likes</span>
            <span>💬 {comments.length} comments</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              currentUser && likes.includes(currentUser.id)
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${currentUser && likes.includes(currentUser.id) ? 'fill-current' : ''}`} />
            <span className="font-semibold">{likes.length}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">{comments.length}</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                  placeholder="Share your thoughts..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!currentUser}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!currentUser || !commentText.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Post
                </button>
              </div>
              {!currentUser && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Please login to comment
                </p>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {comment.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm">{comment.username}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Login Modal Component
const LoginModal = ({ onClose, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onSubmit({ username, password });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your NextEra News account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <p className="font-semibold text-blue-800">Demo Login:</p>
            <p className="text-blue-700">Username: <span className="font-mono">admin</span></p>
            <p className="text-blue-700">Password: <span className="font-mono">admin123</span></p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all"
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Signup Modal Component
const SignupModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    const { confirmPassword, ...userData } = formData;
    onSubmit(userData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Join NextEra News</h2>
          <p className="text-gray-600 mt-2">Create your account to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 font-semibold transition-all"
            >
              Create Account
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add News Modal Component
const AddNewsModal = ({ onClose, onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: categories[0],
    image: '',
    content: '',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      onSubmit({
        ...formData,
        tags
      });
      setFormData({
        title: '',
        category: categories[0],
        image: '',
        content: '',
        tags: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create News Article</h2>
          <p className="text-gray-600 mt-2">Share the latest news with the community</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter news title"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="technology, news, update"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Image URL (optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Write your news content here..."
              required
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold transition-all"
            >
              Publish News
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit News Modal Component
const EditNewsModal = ({ onClose, onSubmit, categories, article }) => {
  const [formData, setFormData] = useState({
    title: article.title,
    category: article.category,
    image: article.image || '',
    content: article.content,
    tags: article.tags ? article.tags.join(', ') : ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      onSubmit({
        ...formData,
        tags
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Edit News Article</h2>
          <p className="text-gray-600 mt-2">Update your news content</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all"
            >
              Update News
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel = ({ onClose, news, users, stats, onDeleteNews, onEditNews }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-6xl w-full my-8 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Manage your NextEra News platform</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {['overview', 'news', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total News</p>
                    <p className="text-2xl font-bold">{stats.totalNews}</p>
                  </div>
                  <FileText className="w-8 h-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Likes</p>
                    <p className="text-2xl font-bold">{stats.totalLikes}</p>
                  </div>
                  <Heart className="w-8 h-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Comments</p>
                    <p className="text-2xl font-bold">{stats.totalComments}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 opacity-80" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage News Articles</h3>
                <span className="text-sm text-gray-500">{news.length} articles</span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {news.map(article => (
                  <div key={article.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{article.title}</h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>By {article.author}</span>
                          <span>{article.category}</span>
                          <span>{new Date(article.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditNews(article)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteNews(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Users</h3>
                <span className="text-sm text-gray-500">{users.length} users</span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map(user => (
                  <div key={user.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {(user.name || user.username).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{user.name || user.username}</h4>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isAdmin 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </span>
                            <span className="text-xs text-gray-500">
                              Joined {new Date(user.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextEraNews;