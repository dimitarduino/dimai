// ... existing imports remain the same ...

export default function ImageToImage() {
    // ... existing state declarations remain the same ...

    const options = [
        "3D", "Anime", "Digital Art", "Photorealistic", 
        "Oil Painting", "Watercolor"
    ]; // Updated style options better suited for HuggingFace

    const generateImageFromStyle = async (imageUrl) => {
        setLoading(true);

        try {
            if (!proveriPoeni(userDetail.credits, 5)) {
                toast("Insufficient credits! Please recharge to generate an image.");
                setLoading(false);
                return;
            }

            const response = await axios.post("/api/imagemod", {
                imageUrl: imageUrl,
                prompt: formData.text || "transform this image",
                style: formData.style
            });

            if (response.data.result) {
                const slednoPoeni = await iskoristPoeni({
                    momentalnoKrediti: userDetail.credits,
                    kolkuMinus: 5,
                    email: user.primaryEmailAddress.emailAddress
                });

                setUserDetail(prev => ({
                    ...prev,
                    "credits": slednoPoeni
                }));

                setModifiedImage(response.data.result);
                setOpenedResult(true);
            }
        } catch (error) {
            toast.error("Error generating image. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ... rest of the component remains the same ...
}