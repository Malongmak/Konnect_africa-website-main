document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryLinks = document.querySelectorAll('.category-list a');
    const blogPosts = document.querySelectorAll('.blog-card');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;

            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            // Filter posts
            blogPosts.forEach(post => {
                if (category === 'all' || post.dataset.category === category) {
                    post.style.display = 'grid';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });

    // Newsletter subscription
    const subscribeForm = document.getElementById('blog-subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;

            try {
                const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Successfully subscribed to the newsletter!');
                    e.target.reset();
                } else {
                    alert(data.error || 'Failed to subscribe. Please try again.');
                }
            } catch (error) {
                console.error('Subscription error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // Load recent posts
    const loadRecentPosts = async () => {
        try {
            const response = await fetch('/api/posts/recent');
            const posts = await response.json();
            
            const recentPostsList = document.querySelector('.recent-posts');
            if (recentPostsList && posts.length) {
                recentPostsList.innerHTML = posts.map(post => `
                    <li>
                        <a href="/blog/${post.slug}">
                            <h4>${post.title}</h4>
                            <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                        </a>
                    </li>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading recent posts:', error);
        }
    };

    // Initialize recent posts
    loadRecentPosts();
}); 