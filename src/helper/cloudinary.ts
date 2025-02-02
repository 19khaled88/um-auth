import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: 'be-fresh-ltd', 
    api_key: '128215362951182', 
    api_secret: 'WbNw7UjHKSAm3axm7bJCCnAhSr8', // Click 'View API Keys' above to copy your API secret
});


const deleteFromCloudinary = async (
    public_ids: string | string[],
    type: 'single' | 'multiple'
): Promise<{ result: string }> => {
    return new Promise((resolve, reject) => {
        const sanitizePublicId = (id: string): string => {

            const parts = id.split('/');
            const fileNameWithExtension = parts[parts.length - 1]; // "m2kakulr0id0lgfxs64k.png"

            // Split by dot to remove the extension
            const publicId = fileNameWithExtension.split('.')[0]; // "m2kakulr0id0lgfxs64k"
            return publicId
        };

        
        try {
            if (type === 'single') {
                if (typeof public_ids !== 'string' || !public_ids.trim()) {
                    return reject(new Error('For single deletion, public_ids must be a non-empty string.'));
                }

                const sanitizedId = sanitizePublicId(public_ids);

                cloudinary.uploader.destroy(sanitizedId, (error, result) => {
                   
                    if (error) {
                        return reject(error);
                    }
                    if (result.result === 'not found') {
                        console.warn(`Resource with public_id "${public_ids}" not found in Cloudinary.`);
                    }
                    resolve(result);
                });
            } else if (type === 'multiple') {
                if (!Array.isArray(public_ids) || public_ids.length === 0) {
                    return reject(new Error('For multiple deletion, public_ids must be a non-empty array of strings.'));
                }

                const sanitizedIds = public_ids.map(sanitizePublicId)

                cloudinary.api.delete_resources(sanitizedIds, (error, result) => {
                    
                    if (error) {
                        return reject(error);
                    }
                    if (result.deleted) {
                        for (const [id, status] of Object.entries(result.deleted)) {
                            if (status === 'not_found') {
                                console.warn(`Resource with public_id "${id}" not found in Cloudinary.`);
                            }
                        }
                    }
                    resolve(result);
                });
            } else {
                return reject(new Error('Invalid type specified. Use "single" or "multiple".'));
            }
        } catch (err) {
            reject(err);
        }
    });
};



export const FileUploadCloudinary = {
    deleteFromCloudinary,
}