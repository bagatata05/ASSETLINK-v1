import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Camera, Upload, Search, AlertTriangle, CheckCircle, QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ReportDamage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [assets, setAssets] = useState([]);
    const [assetSearch, setAssetSearch] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [form, setForm] = useState({ description: '', priority: 'Medium' });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [showQR, setShowQR] = useState(false);
    /** @type {React.MutableRefObject<HTMLInputElement | null>} */
    const fileRef = useRef(null);

    useEffect(() => {
        base44.entities.Asset.list('-created_date', 200).then(setAssets);
    }, []);

    const filteredAssets = assets.filter(a =>
        !assetSearch || a.name?.toLowerCase().includes(assetSearch.toLowerCase()) || a.asset_code?.toLowerCase().includes(assetSearch.toLowerCase())
    );

    function handlePhoto(e) {
        const file = e.target.files[0];
        if (!file) return;
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    }

    async function handleSubmit() {
        if (!selectedAsset || !form.description) { toast.error('Please fill all required fields'); return; }
        setSubmitting(true);
        let photo_url = null;
        if (photo) {
            const { file_url } = await base44.integrations.Core.UploadFile({ file: photo });
            photo_url = file_url;
        }
        const reqNum = `RR-${Date.now().toString().slice(-6)}`;
        await base44.entities.RepairRequest.create({
            request_number: reqNum,
            asset_id: selectedAsset.id,
            asset_name: selectedAsset.name,
            asset_code: selectedAsset.asset_code,
            school_name: selectedAsset.school_name,
            reported_by_email: currentUser?.email,
            reported_by_name: currentUser?.full_name,
            description: form.description,
            priority: form.priority,
            photo_url,
            status: 'Pending',
        });

        // Send critical alert email to principal
        if (form.priority === 'Critical' && selectedAsset.school_id) {
            const schools = await base44.entities.School.list('-created_date', 100);
            const school = schools.find(s => s.id === selectedAsset.school_id || s.name === selectedAsset.school_name);
            if (school?.contact_email) {
                await base44.integrations.Core.SendEmail({
                    to: school.contact_email,
                    subject: `🚨 CRITICAL Damage Report — ${selectedAsset.name} (${selectedAsset.asset_code})`,
                    body: `Dear ${school.principal_name || 'Principal'},\n\nA CRITICAL damage report has been filed that requires your immediate attention.\n\n📋 Request #: ${reqNum}\n🏫 School: ${selectedAsset.school_name}\n🔧 Asset: ${selectedAsset.name} (${selectedAsset.asset_code})\n📍 Location: ${selectedAsset.location || 'Not specified'}\n👤 Reported by: ${currentUser?.full_name} (${currentUser?.email})\n\n📝 Damage Description:\n${form.description}\n\nPlease log in to AssetLink to review and approve this request as soon as possible.\n\n— AssetLink Notification System`,
                });
            }
        }

        setSubmitting(false);
        setDone(true);
    }

    if (done) {
        return (
            <div className="max-w-md mx-auto text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Report Submitted!</h2>
                <p className="text-muted-foreground">Your damage report has been submitted. The principal will review and assign maintenance staff.</p>
                <div className="flex gap-3 justify-center pt-2">
                    <Button variant="outline" onClick={() => { setDone(false); setStep(1); setSelectedAsset(null); setForm({ description: '', priority: 'Medium' }); setPhoto(null); setPhotoPreview(null); }}>
                        Report Another
                    </Button>
                    <Button onClick={() => navigate('/repair-requests')} className="bg-teal hover:bg-teal/90 text-white">
                        View Requests
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Report Damage</h1>
                <p className="text-muted-foreground text-sm mt-1">Submit a repair request for damaged school assets</p>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-2">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-teal text-white' : 'bg-muted text-muted-foreground'}`}>{s}</div>
                        {s < 3 && <div className={`h-0.5 w-12 sm:w-20 transition-all ${step > s ? 'bg-teal' : 'bg-muted'}`} />}
                    </div>
                ))}
                <div className="ml-2 text-sm text-muted-foreground">
                    {step === 1 ? 'Select Asset' : step === 2 ? 'Describe Damage' : 'Add Photo'}
                </div>
            </div>

            {/* Step 1: Select Asset */}
            {step === 1 && (
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search asset by name or code..." className="pl-9" value={assetSearch} onChange={e => setAssetSearch(e.target.value)} />
                        </div>
                        <Button variant="outline" onClick={() => setShowQR(!showQR)} className="gap-2 flex-shrink-0">
                            <QrCode className="w-4 h-4" /> QR Scan
                        </Button>
                    </div>

                    {showQR && (
                        <div className="bg-muted rounded-xl p-6 text-center space-y-3 border-2 border-dashed border-teal/30">
                            <div className="w-40 h-40 mx-auto bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                                <QrCode className="w-16 h-16 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">QR Code Scanner</p>
                                <p className="text-xs text-muted-foreground mt-1">Point your camera at the asset QR code to auto-fill asset details.</p>
                                <p className="text-xs text-muted-foreground mt-2">• Requires camera access on mobile devices</p>
                                <p className="text-xs text-muted-foreground">• QR codes should contain asset ID or asset code</p>
                            </div>
                            {/* BACKEND: Integrate QR scanner library here (e.g., react-qr-reader or jsQR)
                                - Enable camera access
                                - Decode QR code result
                                - Parse asset ID or asset code from QR data
                                - Find matching asset and auto-select it
                                - Example: if QR contains "ast_001", find asset with that ID
                            */}
                            <Button size="sm" variant="outline" onClick={() => setShowQR(false)}>
                                Close Scanner
                            </Button>
                        </div>
                    )}

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredAssets.length === 0 ? (
                            <p className="text-center text-muted-foreground text-sm py-4">No assets found. Add assets first.</p>
                        ) : filteredAssets.map(asset => (
                            <div
                                key={asset.id}
                                onClick={() => setSelectedAsset(asset)}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedAsset?.id === asset.id ? 'border-teal bg-teal/5' : 'border-border hover:border-teal/30 hover:bg-accent/30'}`}
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{asset.name}</p>
                                    <p className="text-xs text-muted-foreground">#{asset.asset_code} · {asset.location || 'No location'} · {asset.school_name || 'No school'}</p>
                                </div>
                                {selectedAsset?.id === asset.id && <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />}
                            </div>
                        ))}
                    </div>

                    <Button onClick={() => setStep(2)} disabled={!selectedAsset} className="w-full bg-teal hover:bg-teal/90 text-white">
                        Continue with: {selectedAsset?.name || 'Select an asset'}
                    </Button>
                </div>
            )}

            {/* Step 2: Describe */}
            {step === 2 && (
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-teal/5 rounded-xl border border-teal/20">
                        <AlertTriangle className="w-5 h-5 text-teal flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-foreground">{selectedAsset.name}</p>
                            <p className="text-xs text-muted-foreground">#{selectedAsset.asset_code} · {selectedAsset.school_name}</p>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Damage Description *</Label>
                        <Textarea
                            rows={4}
                            placeholder="Describe the damage in detail. What is broken? When did you notice it? How severe is it?"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Priority Level</Label>
                        <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low — Minor, non-urgent</SelectItem>
                                <SelectItem value="Medium">Medium — Should be fixed soon</SelectItem>
                                <SelectItem value="High">High — Affecting learning</SelectItem>
                                <SelectItem value="Critical">Critical — Safety hazard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                        <Button onClick={() => setStep(3)} disabled={!form.description} className="flex-1 bg-teal hover:bg-teal/90 text-white">Continue</Button>
                    </div>
                </div>
            )}

            {/* Step 3: Photo */}
            {step === 3 && (
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                    <div
                        onClick={() => fileRef.current && fileRef.current.click()}
                        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-teal/50 hover:bg-teal/5 transition-all"
                    >
                        {photoPreview ? (
                            <div className="relative">
                                <img src={photoPreview} alt="preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                                <button
                                    onClick={e => { e.stopPropagation(); setPhoto(null); setPhotoPreview(null); }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Camera className="w-10 h-10 mx-auto text-muted-foreground opacity-60" />
                                <p className="text-sm text-muted-foreground">Tap to take a photo or upload from gallery</p>
                                <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                            </div>
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                        <Button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-teal hover:bg-teal/90 text-white">
                            {submitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">Photo is optional but strongly recommended</p>
                </div>
            )}
        </div>
    );
}